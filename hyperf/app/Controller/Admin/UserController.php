<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Controller\AbstractController;
use App\Request\UserRequest;
use App\Request\ProfileRequest;
use App\Model\User;
use App\Model\Role;
use Donjan\Casbin\Enforcer;
use App\Exception\AppBadRequestException;

class UserController extends AbstractController
{

    //get
    public function index()
    {
        $params = $this->request->all();
        $pageSize = (int) $this->request->input('per_page', 15);
        $list = User::getList($pageSize, $params);
        return $list;
    }

    //post
    public function store(UserRequest $request)
    {
        $data = $request->all();
        if (empty($data['password'])) {
            throw new AppBadRequestException('请填写密码');
        }
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        unset($data['confirm_password']);
        $user = User::create($data);
        return $user;
    }

    // get
    public function show($id)
    {
        $user = Models\User::where('user_id', '<>', config('super_admin'))->find($id);
        if (!$user) {
            throw new AppBadRequestException("用户ID：{$id}不存在");
        }
        return $user;
    }

    // put
    public function update(UserRequest $request, $id)
    {
        $data = $request->all();
        $user = User::where('id', '<>', config('super_admin'))->find($id);
        if (!$user) {
            throw new AppBadRequestException("用户ID：{$id}不存在");
        }
        if (isset($data['username'])) {
            unset($data['username']);
        }
        if (isset($data['password']) && empty($data['password'])) {
            unset($data['password']);
        } elseif (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        unset($data['confirm_password']);
        $user->update($data);
        return $user;
    }

    // delete
    public function destroy($id)
    {
        
    }

    public function roles($id)
    {
        $roles = $this->request->input('roles', []);
        $user = User::where('id', '<>', config('super_admin'))->find($id);
        if (!$user) {
            throw new AppBadRequestException("用户ID：{$id}不存在");
        }
        $roleList = Role::whereIn('id', $roles)->pluck('name')->all();
        Enforcer::DeleteRolesForUser($user->username);
        Enforcer::AddRolesForUser($user->username, $roleList);
        return $user;
    }

    public function profile(ProfileRequest $request)
    {
        $user = $this->request->getAttribute('user');
        $data = $request->all();
        !empty($data['password']) && $user->password = password_hash($data['password'], PASSWORD_DEFAULT);
        $user->save();
        return $user;
    }

}
