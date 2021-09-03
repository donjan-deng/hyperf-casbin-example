<?php

declare (strict_types=1);

namespace App\Model;

use Donjan\Casbin\Enforcer;

class Role extends Model
{

    protected $table = 'roles';
    public $timestamps = false;

    protected function getList($pageSize, $params)
    {
        $query = $this->query();
        if (!isset($params['sort_name']) || empty($params['sort_name'])) {
            $params['sort_name'] = $this->primaryKey;
        }
        $params['sort_value'] = isset($params['sort_value']) ? ($params['sort_value'] == 'ascend' ? 'asc' : 'desc') : 'desc';
        $list = $query->orderBy($params['sort_name'], $params['sort_value'])->paginate($pageSize);
        foreach ($list as &$value) {
            $value->permissions = $this->getPermissionId($value);
        }
        return $list;
    }

    protected function getPermissionId($role)
    {
        $perms = Enforcer::getFilteredPolicy(0, $role->name);
        if (!$perms) {
            return $perms;
        }
        $query = Permission::query();
        foreach ($perms as $value) {
            $query->orWhere(function($q)use($value) {
                return $q->where('path', $value[1])->where('method', $value[2]);
            });
        }
        return $query->pluck('id');
    }

}
