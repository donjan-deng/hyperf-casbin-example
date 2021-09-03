<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Controller\AbstractController;
use App\Model\Permission;
use App\Request\PermissionRequest;
use App\Exception\AppBadRequestException;

class PermissionController extends AbstractController
{

    public function index()
    {
        $list = Permission::getList(0);
        return $list;
    }

    public function store(PermissionRequest $request)
    {
        $data = $request->all();
        $result = Permission::create($data);
        return $result;
    }

    public function show($id)
    {
        $result = Permission::find($id);
        if (!$result) {
            throw new AppBadRequestException("请求资源不存在");
        }
        return $result;
    }

    public function update(PermissionRequest $request, $id)
    {
        $data = $request->all();
        $result = Permission::find($id);
        if (!$result) {
            throw new AppBadRequestException("请求资源不存在");
        }
        $result->update($data);
        return $result;
    }

    public function destroy($id)
    {
        
    }

}
