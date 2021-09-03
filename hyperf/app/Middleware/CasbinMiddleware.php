<?php

declare(strict_types=1);

namespace App\Middleware;

use Hyperf\Di\Annotation\Inject;
use Hyperf\HttpServer\Contract\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Donjan\Casbin\Enforcer;
use App\Exception\AppBadRequestException;

class CasbinMiddleware implements MiddlewareInterface
{

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = $request->getAttribute('user');
        //$path = $request->getUri()->getPath();
        $server = $request->getServerParams();
        $path = strtolower($server['path_info']);
        $method = strtoupper($server['request_method']);
        if ($user->id === config('super_admin') || (Enforcer::enforce($user->username, $path, $method))) {
            return $handler->handle($request);
        }
        throw new AppBadRequestException('无权进行该操作', 403);
    }

}
