<?php

declare(strict_types=1);

namespace App\Request;

class LoginRequest extends BaseRequest
{

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'username' => ['bail', 'required'],
            'password' => ['bail', 'required'],
           // 'captcha' => ['bail', 'required', 'test_captcha'],
        ];
    }

    public function attributes(): array
    {
        return [
            'username' => '用户名',
            'password' => '密码'
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => '请填写用户名',
            'password.required' => '请填写密码',
//            'captcha.required' => '请填写验证码',
//            'captcha.test_captcha' => '验证码错误',
        ];
    }

}
