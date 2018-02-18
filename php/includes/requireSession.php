<?php
if (!isset($post->session)){
    $response->status = "Error: session missing";
    SendJson($response);
}

if ($post->session == ""){
    $response->status = "Error: session missing";
    SendJson($response);
}

$username = $user->getUserFromSessionID($post->session);
?>