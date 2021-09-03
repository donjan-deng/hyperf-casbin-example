<?php

declare(strict_types=1);

namespace App\Request;

use Hyperf\Validation\Request\FormRequest;
use Hyperf\Validation\Rule;

class PermissionRequest extends BaseRequest
{

    public function rules(): array
    {
        return [
            'path' => [
                'bail',
                'required'
            ],
            'method' => [
                'bail',
                'required'
            ]
        ];
    }

    public function attributes(): array
    {
        return [
            'path' => '权限名称',
            'method' => '请求方法'
        ];
    }

    public function messages(): array
    {
        return [
            'path.required' => '请填写节点路径',
        ];
    }

}
