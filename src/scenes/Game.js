import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
      // create game objects
    this.add.image(512, 384, "sky");
    this.velocidadx= 200;
    this.velocidady= 400;

    // emmit particles from logo
       const emitter = this.add.particles(0, 0, "hoja", {
         speed: 50,
         scale: { start: 0.3, end: 0 },
         //blendMode: "ADD",
       });
   
    // crear la pelota
       this.pelota = this.physics.add.image(512, 384, "pelota");
       this.pelota.setVelocity(this.velocidadx, this.velocidady);
       this.pelota.setBounce(1, 1);
       this.pelota.setCollideWorldBounds(true);
       emitter.startFollow(this.pelota);
     
   // crear la pala
     this.pala = this.physics.add.image(512, 740, "pala");
     this.pala.setImmovable(true);   /// para que al colisionar  no se mueva de su lugar
     this.pala.body.setAllowGravity(false); /// desactivar la gravedad
     
     this.physics.add.collider(this.pelota, this.pala);  ///establece colision entre la pala y la pelota
    
     this.bamboo = this.physics.add.group({
        key: "bamboo",  /// La clave de la imagen del bamboo
        repeat: 4,     /// Número de bamboo
        setXY: { x: 100, y: 100, stepX: 200 }  // Posición inicial y espacio entre el bamboo
        
    });
     
    for (let i = 0; i < 1; i++) {  // 4 filas de bamboo
        let rowY = 150 + i * 50;  // Ajusta la posición Y de cada fila
    
        this.bamboo.createMultiple({
            key: 'bamboo',
            repeat: 4,  // 4 bamboo por fila
            setXY: { x: 100, y: rowY, stepX: 200 }  // Ajusta la posición X e Y
        });
    }

    this.bamboo.children.iterate(function (bamboo) {
        bamboo.setInteractive();  // Hacer el que el bamboo sea interactivo si es necesario
        bamboo.setImmovable(true);  // para que no se mueva
        bamboo.body.setAllowGravity(false);
    });

    this.physics.add.collider(this.pelota, this.bamboo, this.romperbamboo, null, this);

    this.puntos = 0;
    this.puntostexto = this.add.text( 30, 30, "PUNTOS: 0", {
        fontFamily: 'Arial Black', fontSize: 32, color: '#00FA9A',
            stroke: '#20B2AA', strokeThickness: 8,
    });
    
    }

   update() {
     ////movimiento de la pala con el mouse
        this.pala.x = this.input.activePointer.x;
      } 
    
      romperbamboo (pelota,bamboo) { //para que al colicionar se rompan
        bamboo.disableBody(true, true);
        this.puntos += 10;
        this.puntostexto.setText("PUNTOS: " + this.puntos) 
        // Verificar si el grupo está vacío
    if (this.bamboo.countActive(true) === 0) {
        this.reiniciarBambues();
        this.pelota.x=this.pala.x;
        this.pelota.y=this.pala.y -150;
        this.velocidadx=this.velocidadx+(this.velocidadx*0.1)
        this.velocidady=this.velocidady+(this.velocidady*0.1)
        this.pelota.setVelocity(this.velocidadx , this.velocidady)
        console.log("x=" + this.velocidadx + "y=" + this.velocidady)
      }
    }
    reiniciarBambues() {
        this.bamboo.children.iterate(function (bamboo) {
            bamboo.enableBody(true, bamboo.x, bamboo.y, true, true);  // Reactiva el bamboo
        });
    }
}
