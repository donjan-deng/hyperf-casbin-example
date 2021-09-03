<?php

declare(strict_types=1);

namespace App\Middleware;

use Hyperf\Di\Annotation\Inject;
use Hyperf\Utils\Context;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use App\Helper\Jwt;
use App\Exception\JwtException;
use App\Model\User;

class JwtMiddleware implements MiddlewareInterface
{

    /**
     * @Inject
     * @var Jwt
     */
    protected $jwt;

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $token = $this->jwt->checkToken();
        $id = $token->claims()->get('id');
        $user = User::where('id', $id)->where('status', User::STATUS_ENABLE)->first();
        if (!$user) {
            throw new JwtException('Token未验证通过', 401);
        }
        $request = $request->withAttribute('user', $user);
        Context::set(ServerRequestInterface::class, $request);
        return $handler->handle($request);
    }

}
