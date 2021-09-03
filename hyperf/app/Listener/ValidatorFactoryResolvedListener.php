<?php

declare(strict_types=1);

namespace App\Listener;

use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;
use Hyperf\Validation\Contract\ValidatorFactoryInterface;
use Hyperf\Validation\Event\ValidatorFactoryResolved;
use Hyperf\Utils\ApplicationContext;
use Hyperf\Contract\SessionInterface;

class ValidatorFactoryResolvedListener implements ListenerInterface
{

    public function listen(): array
    {
        return [
            ValidatorFactoryResolved::class,
        ];
    }

    public function process(object $event)
    {
        $validatorFactory = $event->validatorFactory;
        // 注册了 foo 验证器
        $validatorFactory->extend('test_captcha', function ($attribute, $value, $parameters, $validator) {
            $session = ApplicationContext::getContainer()->get(SessionInterface::class);
            $captcha = $session->get('captcha','');
            return strtolower($value) == strtolower($captcha);
        });
        $validatorFactory->replacer('test_captcha', function ($message, $attribute, $rule, $parameters) {
            return str_replace(':test_captcha', $attribute, $message);
        });
    }

}
