<?php
include('includes/requireSession.php');

if ($user->getUserLevel($post->session) != Levels::Admin){
    $response->status = "Error: User level is not Admin";
    SendJson($response);
}
?>