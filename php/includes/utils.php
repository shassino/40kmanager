<?php
function SendJson($object){
    print(json_encode($object));
    exit;
}

abstract class Levels{
    const Inactive = -1;
    const Admin = 0;
    const User = 1;
}
?>