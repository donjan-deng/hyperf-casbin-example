<?php

declare(strict_types=1);

namespace App\Request;

class ProfileRequest extends BaseRequest
{

    public function rules(): array
    {
        return [
            'password' => 'sometimes|same:confirm_password',
        ];
    }

    public function messages(): array
    {
        return [
            'password.same' => '两次输入的密码不一致',
        ];
    }

}
