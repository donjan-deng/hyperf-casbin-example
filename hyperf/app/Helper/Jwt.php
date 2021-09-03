<?php

declare(strict_types=1);

namespace App\Helper;

use Hyperf\HttpServer\Contract\RequestInterface;
use App\Exception\JwtException;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\StrictValidAt;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;

class Jwt
{

    protected $config;
    protected $header = 'authorization';
    protected $prefix = 'bearer';
    protected $key = 'token';

    public function __construct()
    {
        $signer = config('jwt.signer');
        $secret = config('jwt.secret');
        $this->config = Configuration::forSymmetricSigner(new $signer(), InMemory::plainText($secret));
        $this->config->setValidationConstraints(
                new SignedWith(new $signer(), InMemory::plainText($secret)), new StrictValidAt(SystemClock::fromSystemTimezone())
        );
    }

    public function buildToken(array $claims, int $ttl = null)
    {
        $now = SystemClock::fromSystemTimezone()->now();
        $uniqid = uniqid();
        $ttl = $ttl ?: config('jwt.ttl');
        $expTime = new \DateInterval('PT' . $ttl . 'S');
        $builder = $this->config->builder()
                ->identifiedBy($uniqid)
                ->issuedAt($now)
                ->canOnlyBeUsedAfter($now)
                ->expiresAt($now->add($expTime));
        foreach ($claims as $k => $v) {
            $builder = $builder->withClaim($k, $v);
        }
        return $builder->getToken($this->config->signer(), $this->config->signingKey());
    }

    public function checkToken()
    {
        $tokenStr = $this->getToken();
        if (!$tokenStr) {
            throw new JWTException('Token authentication does not pass', 401);
        }
        $token = $this->config->parser()->parse($tokenStr);
        if (!($token instanceof UnencryptedToken)) {
            throw new JwtException('Token authentication does not pass', 401);
        }
        if (!$this->verifyToken($token)) {
            throw new JwtException('Token authentication does not pass', 401);
        }
        return $token;
    }

    public function verifyToken(UnencryptedToken $token)
    {
        $constraints = $this->config->validationConstraints();
        return $this->config->validator()->validate($token, ...$constraints);
    }

    protected function getToken()
    {
        $request = \Hyperf\Utils\ApplicationContext::getContainer()->get(RequestInterface::class);
        $token = $this->getHeaderToken($request); //先从header获取token
        !$token && $token = $request->input($this->key); //从请求参数获取token
        return $token;
    }

    protected function getHeaderToken($request)
    {
        $serverParams = $request->getServerParams();
        $serverAuth = isset($serverParams['HTTP_AUTHORIZATION']) ? $serverParams['HTTP_AUTHORIZATION'] : (isset($serverParams['REDIRECT_HTTP_AUTHORIZATION']) ? $serverParams['REDIRECT_HTTP_AUTHORIZATION'] : '');
        $header = $request->getHeaderLine($this->header) ?: $serverAuth;
        if ($header && preg_match('/' . $this->prefix . '\s*(\S+)\b/i', $header, $matches)) {
            return $matches[1];
        }
    }

}
