<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ToolController extends Controller
{
    /**
     * Toggle the status of a tool for the authenticated user.
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'tool' => 'required|string',
            'enable' => 'required|boolean',
        ]);

        $user = $request->user();
        $tool = $request->input('tool');
        $enable = $request->input('enable');

        $enabledTools = $user->enabled_tools ?? [];

        if ($enable) {
            if (!in_array($tool, $enabledTools)) {
                $enabledTools[] = $tool;
            }
        } else {
            $enabledTools = array_values(array_diff($enabledTools, [$tool]));
        }

        $user->enabled_tools = $enabledTools;
        $user->save();

        return Redirect::back();
    }
}
