exports.index = function(req, res){
  config = require('../config');
  
  scripts = config.get('scripts');
  
  scripts.push('javascripts/vid.js');
  
  styles = config.get('styles');
  
  styles.push('stylesheets/video.css');
  
  res.render('video', {
	styles : styles,
	scripts : scripts}
	);
};
