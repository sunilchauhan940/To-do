<?php 

/* Getting file name */
$filename = $_FILES['file']['name']; 
echo $filename;
/* Location */
$location = "img/".$filename; 
$uploadOk = 1; 
echo $location;
if($uploadOk == 0){ 
echo 0; 
}else{ 
/* Upload file */
if(move_uploaded_file($_FILES['file']['tmp_name'], $location)){ 
	echo $location; 
}else{ 
	echo 0; 
} 
} 
?> 
