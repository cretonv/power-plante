import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"

 export var GlobalLoader = (function() {
    var constructeur = function() {

      this.getCurrentBackground = function(){
        return backgroundtexture
      }
      this.setCurrentBackground = function(){
        backgroundtexture
      }      
      
    }

    var backgroundtexture = null;

    var instance = null;
    return new function() {
      this.getInstance = function() {
        if (instance == null) {

          instance = new constructeur();
          instance.constructeur = null;
          //Load all scenes ( no init for now )
        
        }
        
        return instance;
      }
    }
  })();