<?php

declare (strict_types=1);

namespace App\Model;

use Donjan\Casbin\Enforcer;

class User extends Model
{

    protected $table = 'users';
    protected $hidden = [
        'password', 'updated_at'
    ];
    public static $status = [
        0 => '禁用',
        1 => '正常'
    ];

    public function getStatusTextAttribute()
    {
        return $this->attributes['status_text'] = $this->getFormatState($this->attributes['status'], self::$status);
    }

    protected function getList($pageSize, $params)
    {
        $query = $this->where($this->primaryKey, '<>', config('super_admin'));
        (isset($params['status']) && $params['status'] !== "") && $query->where('status', '=', $params['status']);
        (isset($params['username']) && !empty($params['username'])) && $query->where('username', 'like', "%{$params['username']}%");
        if (isset($params['start_time']) && isset($params['end_time']) && !empty($params['start_time']) && !empty($params['end_time'])) {
            $query->where('created_at', '>=', $params['start_time'])->where('created_at', '<=', $params['end_time']);
        }
        if (!isset($params['sort_name']) || empty($params['sort_name'])) {
            $params['sort_name'] = $this->primaryKey;
        }
        $params['sort_value'] = isset($params['sort_value']) ? ($params['sort_value'] == 'ascend' ? 'asc' : 'desc') : 'desc';
        $list = $query->orderBy($params['sort_name'], $params['sort_value'])->paginate($pageSize);
        foreach ($list as &$value) {
            $value->status_text;
            $value->roles = Enforcer::GetRolesForUser($value->username);
        }
        return $list;
    }

}
