'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Zap, Trash2, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { useInstagramStore } from '@/lib/instagram/store';
import { CreateAutomationDialog } from './create-automation-dialog';

export function AutomationRules() {
  const { automationRules, updateAutomationRule, deleteAutomationRule } =
    useInstagramStore();

  const handleToggleActive = (ruleId: string, isActive: boolean) => {
    updateAutomationRule(ruleId, { isActive });
  };

  return (
    <div className="space-y-6">
      {automationRules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Zap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Automation Rules</h3>
            <p className="text-muted-foreground mb-4">
              Create your first automation rule to start engaging with your
              audience automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        automationRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  {rule.postId ? 'Post-Specific Rule' : 'Global Rule'}
                  {!rule.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </CardTitle>
                <CardDescription>Trigger: "{rule.trigger}"</CardDescription>
              </div>
              <Switch
                checked={rule.isActive}
                onCheckedChange={(checked) =>
                  handleToggleActive(rule.id, checked)
                }
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {rule.autoReply && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Auto Reply</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.response}
                      </p>
                    </div>
                  </div>
                )}

                {rule.sendDm && rule.dmMessage && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">DM Message</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.dmMessage}
                      </p>
                    </div>
                  </div>
                )}

                {rule.actionUrl && (
                  <div className="flex items-start gap-2">
                    <LinkIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Action URL</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.actionUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <CreateAutomationDialog
                  existingRule={rule}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Edit Rule
                    </Button>
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAutomationRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
