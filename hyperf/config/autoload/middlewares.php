<?php

declare(strict_types=1);

use App\Middleware\CorsMiddleware;
use Hyperf\Session\Middleware\SessionMiddleware;
use Hyperf\Validation\Middleware\ValidationMiddleware;

return [
    'http' => [
        CorsMiddleware::class,
        SessionMiddleware::class,
        ValidationMiddleware::class
    ],
];
