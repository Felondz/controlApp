<?php

namespace App\Modules\Chat;

use App\Core\Modules\AbstractModule;
use App\Models\Proyecto;

/**
 * ChatModule
 * 
 * Real-time messaging and collaboration module.
 */
class ChatModule extends AbstractModule
{
    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'chat';
    }

    /**
     * {@inheritdoc}
     */
    public function getVersion(): string
    {
        return '1.0.0';
    }

    /**
     * {@inheritdoc}
     */
    public function getDependencies(): array
    {
        return []; // No dependencies
    }

    /**
     * {@inheritdoc}
     */
    public function getCapabilities(): array
    {
        return [
            'provides' => [
                'real_time_messaging',
                'project_chat',
                'private_messaging',
                'message_notifications',
            ],
            'consumes' => [],
            'exposes' => [
                'api' => [
                    '/api/proyectos/{proyecto}/messages',
                    '/api/messages/unread',
                ],
                'events' => [
                    'chat.message.sent',
                    'chat.message.read',
                    'chat.conversation.created',
                ],
                'widgets' => [
                    'ChatWidget',
                    'InboxWidget',
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getRoutes(): array
    {
        // Routes managed in routes/api.php
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getEventListeners(): array
    {
        return [
            'chat.message.sent' => [
                \App\Modules\Chat\Listeners\UpdateUnreadCount::class,
            ],
        ];
    }

    /**
     * Hook called when module is installed.
     *
     * @param Proyecto $project
     * @param array $config
     * @return void
     */
    protected function onInstall(Proyecto $project, array $config): void
    {
        // No special installation needed
        // Chat is available immediately
    }

    /**
     * Hook called when module is uninstalled.
     *
     * @param Proyecto $project
     * @return void
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Don't delete messages, just disable module
        // Message history is important
    }
}
