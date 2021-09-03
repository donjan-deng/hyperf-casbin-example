<?php

declare (strict_types=1);

namespace App\Model;

class Permission extends Model
{

    protected $table = 'permissions';
    public $timestamps = false;

    protected function getList($parentId = 0)
    {
        $query = $this->where('parent_id', '=', $parentId);
        $result = $query->orderBy('sort', 'desc')->get();
        foreach ($result as &$value) {
            $value['child'] = $this->getList($value['id']);
        }
        return $result;
    }

}
