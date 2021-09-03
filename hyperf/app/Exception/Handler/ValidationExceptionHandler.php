<?php

declare(strict_types=1);

namespace App\Exception\Handler;

use Hyperf\ExceptionHandler\ExceptionHandler;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Psr\Http\Message\ResponseInterface;
use Throwable;
use Hyperf\Di\Annotation\Inject;
use App\Helper\Helper;
use App\Helper\Code;
use App\Exception;

class ValidationExceptionHandler extends \Hyperf\Validation\ValidationExceptionHandler
{

    /**
     * @Inject
     * @var Helper
     */
    protected $helper;

    public function handle(Throwable $throwable, ResponseInterface $response)
    {
        $this->stopPropagation();
        $result = $this->helper->error($throwable->status, $throwable->validator->errors()->first(), $throwable->validator->errors());
        return $response->withStatus($throwable->status)
                        ->withAddedHeader('content-type', 'application/json')
                        ->withBody(new SwooleStream($this->helper->jsonEncode($result)));
    }

}
