

 export var AppLiveParameter = (function() {
    var constructeur = function() {
      this.getCurrentScene = function() {
        return scene_id
      }
      this.setCurrentScene = function(new_id:string) {
        scene_id =new_id
      }
      
    }
    var scene_id="scene1";
    var instance = null;
    return new function() {
      this.getInstance = function() {
        if (instance == null) {
          instance = new constructeur();
          instance.constructeur = null;

        }
        
        return instance;
      }
    }
  })();