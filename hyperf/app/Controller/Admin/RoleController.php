<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Controller\AbstractController;
use App\Model\Role;
use App\Model\Permission;
use App\Request\RoleRequest;
use App\Exception\AppBadRequestException;
use Donjan\Casbin\Enforcer;

class RoleController extends AbstractController
{

    public function index()
    {
        $params = $this->request->all();
        $pageSize = (int) $this->request->input('per_page', 15);
        $list = Role::getList($pageSize, $params);
        return $list;
    }

    public function store(RoleRequest $request)
    {
        $data = $request->all();
        $permissions = $request->input('permissions', []);
        unset($data['permissions']);
        $result = Role::create($data);
        $perms = Permission::whereIn('id', $permissions)->get();
        $rows = [];
        foreach ($perms as $value) {
            $rows[] = [$result->name, $value->path, $value->method];
        }
        Enforcer::AddNamedPolicies('p', $rows);
        return $result;
    }

    public function update(RoleRequest $request, $id)
    {
        $data = $request->all();
        $permissions = $request->input('permissions', []);
        $result = Role::find($id);
        if (!$result) {
            throw new AppBadRequestException("请求资源不存在");
        }
        unset($data['permissions']);
        if (isset($data['name'])) {
            unset($data['name']);
        }
        $result->update($data);
        $perms = Permission::whereIn('id', $permissions)->get();
        $rows = [];
        foreach ($perms as $value) {
            $rows[] = [$result->name, $value->path, $value->method];
        }
        Enforcer::RemoveFilteredPolicy(0, $result->name);
        Enforcer::AddNamedPolicies('p', $rows);
        return $result;
    }

    public function destroy($id)
    {
        
    }

}
