<?php

declare(strict_types=1);

namespace App\Helper;

use App\Helpers\Code;

Class Helper
{

    //返回成功
    public function success($data)
    {
        return $this->result(Code::SUCCESS, Code::getMessage(Code::SUCCESS), $data);
    }

    //返回错误
    public function error($code = 422, $message = '', $data = [])
    {
        if (empty($message)) {
            return $this->result($code, Code::getMessage($code), $data);
        } else {
            return $this->result($code, $message, $data);
        }
    }

    public function result($code, $message, $data)
    {
        return ['code' => $code, 'message' => $message, 'data' => $data];
    }

    public function jsonEncode($data)
    {
        return json_encode($data, JSON_UNESCAPED_UNICODE);
    }

}
