<?php

declare(strict_types=1);

namespace App\Exception;

use Hyperf\Server\Exception\ServerException;

class AppBadRequestException extends ServerException
{

    public function __construct(string $message = "", int $code = 400)
    {
        parent::__construct($message, $code);
    }

}
