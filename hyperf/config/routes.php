<?php

declare(strict_types=1);

use Hyperf\HttpServer\Router\Router;
use App\Middleware\JwtMiddleware;
use App\Middleware\CasbinMiddleware;

Router::addGroup('/admin/', function () {
    Router::post('login', 'App\Controller\Admin\AppController@login');
    Router::get('captcha', 'App\Controller\Admin\AppController@captcha');
    Router::post('refresh_token', 'App\Controller\Admin\AppController@refreshToken', ['middleware' => [JwtMiddleware::class]]);
    Router::get('app', 'App\Controller\Admin\AppController@index', ['middleware' => [JwtMiddleware::class]]);
    Router::put('profile', 'App\Controller\Admin\UserController@profile', ['middleware' => [JwtMiddleware::class]]);
    //user
    Router::get('users', 'App\Controller\Admin\UserController@index', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::post('users', 'App\Controller\Admin\UserController@store', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::get('users/{id}', 'App\Controller\Admin\UserController@show', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::put('users/{id}', 'App\Controller\Admin\UserController@update', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::delete('users/{id}', 'App\Controller\Admin\UserController@destroy', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::put('users/{id}/roles', 'App\Controller\Admin\UserController@roles', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    //role
    Router::get('roles', 'App\Controller\Admin\RoleController@index', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::post('roles', 'App\Controller\Admin\RoleController@store', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::put('roles/{id}', 'App\Controller\Admin\RoleController@update', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::delete('roles/{id}', 'App\Controller\Admin\RoleController@destroy', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    //permission
    Router::get('permissions', 'App\Controller\Admin\PermissionController@index', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::post('permissions', 'App\Controller\Admin\PermissionController@store', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::put('permissions/{id}', 'App\Controller\Admin\PermissionController@update', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
    Router::delete('permissions/{id}', 'App\Controller\Admin\PermissionController@destroy', ['middleware' => [JwtMiddleware::class, CasbinMiddleware::class]]);
});

Router::get('/favicon.ico', function () {
    return '';
});
