<?php
if (!isset($post->session)){
    $response->status = "Error: session missing";
    SendJson($response);
}

if ($post->session == ""){
    $response->status = "Error: session missing";
    SendJson($response);
}

if ($user->getUserLevel($post->session) != Levels::Admin){
    $response->status = "Error: User level is not Admin";
    SendJson($response);
}
?>