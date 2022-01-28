class Tableau1 extends Phaser.Scene{

    preload(){
        this.load.image('square','asset/carre.png');
        this.load.image('pelote','asset/pelote.png');
        this.load.image('tapis','asset/tapis.png');
        this.load.image('biscotte','asset/chat1.png');
        this.load.image('ponpon','asset/chat2.png');

        for(let e=1;e<=2;e++){
            this.load.image('penche'+e, 'asset/penche/penche'+e+'.png');
        }
    }

    create(){

        this.hauteur = 500
        this.largeur = 1000
        this.speedX = 0
        while(this.speedX===0){
            this.speedX = 500*Phaser.Math.Between(-1,1)
        }
        this.speedY = Phaser.Math.Between(-500, 500)
        this.maxspeed = 500

        //---------------------------------------------
        this.add.image(500,250,'tapis')

        this.anims.create({
            key: 'j1',
            frames: [
                {key:'penche1'},
                {key:'biscotte'},
            ],
            frameRate: 1,
            repeat: 0,
        });
        this.anims.create({
            key: 'j2',
            frames: [
                {key:'penche2'},
                {key:'ponpon'},
            ],
            frameRate: 1,
            repeat: 0,
        });

        this.balle = this.physics.add.sprite(this.largeur/2, this.hauteur/2, 'pelote')

        this.balle.setDisplaySize(36, 36)
        this.balle.body.setSize(20, 20);
        this.balle.body.setBounce(1,1);
        this.balle.body.setAllowGravity(false)

        this.haut = this.physics.add.sprite(0, 0, 'square').setOrigin(0, 0)
        this.haut.setDisplaySize(this.largeur, 20)
        this.haut.body.setAllowGravity(false)
        this.haut.setImmovable(true);
        this.haut.flipY=true;
        this.haut.flipX=true;


        this.bas = this.physics.add.sprite(0, 480, 'square').setOrigin(0, 0)
        this.bas.setDisplaySize(this.largeur, 20)
        this.bas.body.setAllowGravity(false)
        this.bas.setImmovable(true);


        this.player1 = this.physics.add.sprite(50, 360, 'biscotte').setOrigin(0, 0)
        this.player1.setDisplaySize(80,100)

        this.player2 = this.physics.add.sprite(880, 360, 'ponpon').setOrigin(0, 0)
        this.player2.setDisplaySize(80,100)

        this.player1.setImmovable(true)
        this.player2.setImmovable(true)

        let me = this;
        this.physics.add.collider(this.player1, this.balle,function(){
            me.rebondG(me.player1)
        })
        this.physics.add.collider(this.player2, this.balle,function(){
            me.rebondD(me.player2)
        })

        this.physics.add.collider(this.balle, this.bas)
        this.physics.add.collider(this.balle, this.haut)

        this.balle.setMaxVelocity(this.maxspeed,this.maxspeed)

        this.physics.add.collider(this.haut, this.player1)
        this.physics.add.collider(this.bas, this.player1)

        this.physics.add.collider(this.haut, this.player2)
        this.physics.add.collider(this.bas, this.player2)

        this.player1Speed = 0
        this.player2Speed = 0

        if(this.balle<0)
        {
            this.scoreplayer2 +=1;
            this.textplayer1.setText('Player 1 = ' + this.scoreplayer1);

        }

        if(this.balle>this.largeur)
        {
            this.scoreplayer1  +=1;
            this.textplayer2.setText('Player 2 = ' + this.scoreplayer2);
        }


        this.joueurGauche = new Joueur('𝐁𝐢𝐬𝐜𝐨𝐭𝐭𝐞','joueurGauche')
        this.joueurDroite = new Joueur('𝐏𝐫𝐨𝐟𝐞𝐬𝐬𝐞𝐮𝐫 𝐏𝐨𝐦','joueurDroite')
        window.toto=this.joueurGauche;
        console.log(this.joueurGauche)


        this.balleAucentre();
        this.initKeyboard()

        this.tweens.add({
            targets:[this.balle],
            rotation: 6,
            ease :'Repeat',
            repeat:-1,
            duration:1000,
        })

    }

    rebondG(player1) {

        this.rando = this.balle.y - player1.y
        this.coeff = this.rando / 100
        this.coeff = this.coeff * 10 - 5
        this.balle.setVelocityY(this.balle.body.velocity.y + this.coeff * 50)
        console.log(this.balle.x, this.balle.y)
        this.player1.play('j1')
    }

    rebondD(player2) {

        this.rando = this.balle.y - player2.y
        this.coeff = this.rando / 100
        this.coeff = this.coeff * 10 - 5
        this.balle.setVelocityY(this.balle.body.velocity.y + this.coeff * 50)
        console.log(this.balle.x, this.balle.y)
        this.player2.play('j2')
    }





    balleAucentre(){
        this.balle.x = this.largeur/2
        this.balle.y = this.hauteur/2
        this.speedX = 0

        this.balle.setVelocityX(Math.random()>0.5?-300:300)
        this.balle.setVelocityY(0)

        this.player1.y=this.hauteur/2-50
        this.player2.y=this.hauteur/2-50
    }

    /**
     *
     * @param {Joueur} joueur
     */
    win(joueur){
        //alert('Joueur '+joueur.name+' gagne')
        joueur.score ++;
        //alert('Le score est de '+this.joueurGauche.score+' a '+this.joueurDroite.score)
        this.balleAucentre();
    }

    update(){
        if(this.balle.x > this.largeur){
            this.player1.setY(250)
            this.player2.setY(250)
        }
        if(this.balle.x <0){
            this.player1.setY(250)
            this.player2.setY(250)
        }

        if(this.balle.x>this.largeur){
            this.win(this.joueurGauche);
        }

        if(this.balle.x<0){
            this.win(this.joueurDroite);
        }

        this.player1.y += this.player1Speed
        this.player2.y += this.player2Speed
    }

    initKeyboard(){
        let me = this
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.player1Speed = -5
                    break;
                case Phaser.Input.Keyboard.KeyCodes.X:
                    me.player1Speed = 5
                    break;
                case Phaser.Input.Keyboard.KeyCodes.J:
                    me.player2Speed = -5
                    break;
                case Phaser.Input.Keyboard.KeyCodes.N:
                    me.player2Speed = 5
                    break;
            }
        });
        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.player1Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.X:
                    me.player1Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.J:
                    me.player2Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.N:
                    me.player2Speed = 0
                    break;
            }
        });
    }
}

