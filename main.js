img = "";

objects = [];

status = "";

alarmSound = "";

monitoring = false;


function preload() {

    alarmSound = loadSound('Alarm_sound.mp3');

}


function setup() {

    canvas = createCanvas(380, 380);

    canvas.position(450, 280);

    video = createCapture(VIDEO);

    video.size(380, 380);

    video.hide();

}


function start() {

    monitoring = true;

    objectDetector = ml5.objectDetector('cocossd', modelLoaded);

    document.getElementById("status").innerHTML =
        "Status : Detecting Objects";

    document.getElementById("baby_status").innerHTML =
        "Baby Not Detected";

}


function modelLoaded() {

    console.log("Model Loaded!");

    status = true;

    objectDetector.detect(video, gotResult);

}


function gotResult(error, results) {

    if (error) {

        console.log(error);

        return;

    }

    console.log(results);

    objects = results;

    if (monitoring == true) {

        objectDetector.detect(video, gotResult);

    }

}


function draw() {

    image(video, 0, 0, 380, 380);


    if (status != "" && monitoring == true) {

        document.getElementById("status").innerHTML =
            "Status : Object Detected";

        document.getElementById("number_of_objects").innerHTML =
            "Number of Objects Detected : " + objects.length;


        babyFound = false;


        if (objects.length > 0) {

            for (i = 0; i < objects.length; i++) {

                r = random(225);

                g = random(225);

                b = random(225);


                fill(r, g, b);

                percent = floor(objects[i].confidence * 100);

                text(
                    objects[i].label + " " + percent + "%",
                    objects[i].x + 15,
                    objects[i].y + 15
                );


                noFill();

                stroke(r, g, b);

                rect(
                    objects[i].x,
                    objects[i].y,
                    objects[i].width,
                    objects[i].height
                );




                if (objects[i].label == "person") {

                    babyFound = true;

                    document.getElementById("baby_status").innerHTML =
                        "Baby Detected";

                    alarmSound.stop();

                }

            }




            if (babyFound == false) {

                document.getElementById("baby_status").innerHTML =
                    "Baby Not Detected";

                if (!alarmSound.isPlaying()) {

                    alarmSound.loop();

                }

            }

        }




        else {

            document.getElementById("baby_status").innerHTML =
                "Baby Not Detected";

            if (!alarmSound.isPlaying()) {

                alarmSound.loop();

            }

        }

    }

}