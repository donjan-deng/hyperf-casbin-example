<?php

declare(strict_types=1);

return [
    'secret' => env('JWT_SECRET', 'hyperf'),
    'keys' => [
        # 公钥
        'public' => env('JWT_PUBLIC_KEY'),
        # 私钥
        'private' => env('JWT_PRIVATE_KEY'),
    ],
    # token过期时间，单位为秒
    'ttl' => env('JWT_TTL', 7200),
    # jwt的加密算法
    'signer' => env('JWT_ALG', \Lcobucci\JWT\Signer\Hmac\Sha256::class),
];
