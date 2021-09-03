<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Controller\AbstractController;
use Donjan\Casbin\Enforcer;
use App\Model\Permission;
use Gregwar\Captcha\CaptchaBuilder;
use Gregwar\Captcha\PhraseBuilder;
use Hyperf\HttpMessage\Stream\SwooleStream;
use App\Exception\AppBadRequestException;
use App\Model\User;
use App\Request\LoginRequest;

class AppController extends AbstractController
{

    public function index()
    {
        $user = $this->request->getAttribute('user');
        if ($user->id == config('super_admin')) {
            $perms = Permission::all();
            $perms = $perms->map(function($item, $key) {
                return [$item->id, $item->path, $item->method];
            });
        } else {
            $perms = Enforcer::GetImplicitPermissionsForUser($user->username);
        }
        //输出初始化数据
        $data = [
            'user' => $user,
            'permissions' => $perms,
            'data' => []
        ];
        return $data;
    }

    public function login(LoginRequest $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');
        $remember = $request->input('remember');
        $ttl = $remember ? 31536000 : config('jwt.ttl');
        $user = User::where('username', '=', $username)->first();
        if (!$user) {
            throw new AppBadRequestException("用户{$username}不存在");
        }
        if (!password_verify($password, $user->password)) {
            throw new AppBadRequestException("用户名或者密码错误");
        }
        if ($user->status != User::STATUS_ENABLE) {
            throw new AppBadRequestException("用户{$username}已禁用");
        }
        $token = $this->jwt->buildToken(['id' => $user->id], $ttl);
        return ['access_token' => $token->toString(), 'expires_in' => $ttl];
    }

    public function refreshToken()
    {
        $user = $this->request->getAttribute('user');
        $ttl = config('jwt.ttl');
        $token = $this->jwt->buildToken(['id' => $user->id], $ttl);
        return ['access_token' => $token->toString(), 'expires_in' => $ttl];
    }

    public function captcha()
    {
        $length = $this->request->input('length', 4);
        $width = $this->request->input('width', 80);
        $height = $this->request->input('height', 35);
        $phraseBuilder = new PhraseBuilder($length);
        $builder = new CaptchaBuilder(null, $phraseBuilder);
        $builder->build($width, $height);
        $phrase = $builder->getPhrase();
        $this->session->set('captcha', $phrase);
        $output = $builder->get();
        return $this->response
                        ->withAddedHeader('content-type', 'image/jpeg')
                        ->withBody(new SwooleStream($output));
    }

}
