var PLAY=1;
var END=0;
var gameState = PLAY;
var trex,trex_running;
var spikes;
var groundImage,restartImg,gameOverImg,invisibleGround;
var obstaclesGroup,landgroup;
var score=0;
function preload(){
    trex_running =   loadAnimation( "trex3.png","trex4.png");
    trex_collided = loadAnimation("trex_collided.png");
    spikes = loadImage("spikes.png");
    groundImage=loadImage("ground2.png");
    restartImg=loadImage("restart.png");
    gameOverImg=loadImage("gameOver.png");
    bg=loadImage("bg.png");
    localStorage["HighestScore"] = 0;
  }
function setup(){
    createCanvas(600,200);
    trex = createSprite(60,140,20,50);
    trex.addAnimation("running", trex_running);
    trex.scale = 0.5;

    invisibleground = createSprite(30,180,400,20);
    invisibleground.visible=false;

    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    ground.velocityX = -(6 + 3*score/100);

    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(300,140);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.5;
  
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup=new Group();
    landgroup=new Group();
    score=0;
}
function draw(){
background(bg);
text("Score: "+ score, 500,50);
if (gameState===PLAY){
  score = score + Math.round(getFrameRate()/60);
  ground.velocityX = -(6 + 3*score/100);

  if(keyDown("space") && trex.y >= 159) {
    trex.velocityY = -12;
  }

  trex.velocityY = trex.velocityY + 0.8

  if (ground.x < 0){
    ground.x = ground.width/2;
  }

  trex.collide(invisibleGround);
  spawnObstacles();
  spawnflyland();

  if(obstaclesGroup.isTouching(trex)){
      gameState = END;
  }
}
else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  
  //set velcity of each game object to 0
  ground.velocityX = 0;
  trex.velocityY = 0;
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);
  
  //change the trex animation
  trex.changeAnimation("collided",trex_collided);
  
  //set lifetime of the game objects so that they are never destroyed
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
  
  if(mousePressedOver(restart)) {
    reset();
  }
}

 drawSprites();   
}
function spawnflyland() {
    if (frameCount % 100 === 0) {
      var land = createSprite(600,120,40,10);
      land.y = Math.round(random(80,120));
      land.velocityX = -3;
      
       land.lifetime = 200;
      
      //add each cloud to the group
      landgroup.add(land);
    }
    
  }
  
  function spawnObstacles() {
    if(frameCount % 100 === 0) {
      var obstacle = createSprite(600,165,10,40);

      obstacle.velocityX= -2
      obstacle.addImage(spikes);

      obstacle.scale = 0.5;
      obstacle.lifetime = 300;

      obstaclesGroup.add(obstacle);
    }
  }
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    trex.changeAnimation("running",trex_running);
    
    if(localStorage["HighestScore"]<score){
      localStorage["HighestScore"] = score;
    }
    console.log(localStorage["HighestScore"]);
    
    score = 0;
    
  }