import {api} from './library';

export function uploadImage(file, callback) {
  if (!file) return;
  console.log("uploading file::: ", file.name)
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function() {
    var image_content = reader.result
    api('/upload_image',
        {
          "image_file_content": image_content,
          "filename": file.name},
        function(backend_output){
          callback(backend_output.uploaded_image_name)
        });
  }
}
