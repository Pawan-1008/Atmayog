
let vdo;
let poseNet;
let pose;
let skeleton;
let brain;
let state = 'waiting';
let targetLabel;
// let key;


function keyPressed()
{
    // prompt("press any key to save it" + key);
    
   if(key == 's')
    {
        brain.saveData();
    }

    else{
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function(){
        state = 'collecting';
        setTimeout(function(){
            console.log('not collecting');
            state = 'waiting';
        }, 1000);
    }, 1000);
}
    }




function setup()
{
    createCanvas(1000, 1000);
    vdo = createCapture(VIDEO);
    vdo.hide();
    poseNet = ml5.poseNet(vdo, modelLoaded);
    poseNet.on('pose', gotPoses);


    let options = {
        inputs: 34,
        outputs: 4,
        task: 'classification',
        debug: true
    }
    brain = ml5.neuralNetwork(options);
    brain.loadData('tadasan.json', dataReady);
    
}

function dataReady()
{
    if(key == 't')
    {
        brain.normalizeData();
        console.log(brain.data);
        brain.train({epochs: 50}, finished);
    }
}

function finished()
{

    console.log('model is trained');
    brain.save(); 
}

function gotPoses(poses)
{
    console.log(poses);
    if(poses.length>0){
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
        if(state == 'collecting')
        {
            let inputs = [];
            for(let i = 0; i<pose.keypoints.length; i++){
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);

            }
            let target  = [targetLabel];
            brain.addData(inputs, target);
        }
    }

}

function modelLoaded()
{
    console.log("poseNet is ready");
}


function draw()
{
    // background(250, 0, 0);
    translate(vdo.width, 0);
    scale(-1, 1);
    image(vdo, 0, 0, vdo.width, vdo.height);

    if(pose){

        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = dist(eyeR.x,eyeR.y,eyeL.x,eyeL.y);
    
        // fill(255,0,0);
        ellipse(pose.nose.x, pose.nose.y, d);
        // fill(0,0,255);
        ellipse(pose.rightWrist.x, pose.rightWrist.y, 10);
        ellipse(pose.leftWrist.x, pose.leftWrist.y, 20);


        for(let i=0; i<pose.keypoints.length; i++)
        {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            // fill(0,255,0);
            // ellipse(x,y,14,14);

        }

        for(let i=0; i<skeleton.length; i++){
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }

    }
    
}