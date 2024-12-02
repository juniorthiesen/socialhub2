"use client";

import { useState } from "react";
import { useInstagramStore } from "@/lib/instagram/store";
import { AutomationRule, MessageButton } from "@/lib/instagram/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Zap, MessageSquare, Link, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CreateAutomationDialogProps {
  postId?: string;
  trigger?: React.ReactNode;
  existingRule?: AutomationRule;
}

export function CreateAutomationDialog({ 
  postId, 
  trigger,
  existingRule 
}: CreateAutomationDialogProps) {
  const { addAutomationRule, updateAutomationRule, automationRules } = useInstagramStore();
  const [open, setOpen] = useState(false);
  const [useExistingRule, setUseExistingRule] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [formData, setFormData] = useState<Partial<AutomationRule>>(
    existingRule || {
      trigger: "",
      response: "",
      dmMessage: "",
      dmTemplate: {
        template_type: "button",
        text: "",
        buttons: []
      },
      actionUrl: "",
      isActive: true,
      sendDm: false,
      autoReply: true,
    }
  );

  const globalRules = automationRules.filter(rule => !rule.postId);

  const addButton = () => {
    if (!formData.dmTemplate || formData.dmTemplate.buttons.length >= 3) return;
    
    setFormData({
      ...formData,
      dmTemplate: {
        ...formData.dmTemplate,
        buttons: [
          ...formData.dmTemplate.buttons,
          { type: 'web_url', title: '', url: '' }
        ]
      }
    });
  };

  const removeButton = (index: number) => {
    if (!formData.dmTemplate) return;
    
    const newButtons = [...formData.dmTemplate.buttons];
    newButtons.splice(index, 1);
    
    setFormData({
      ...formData,
      dmTemplate: {
        ...formData.dmTemplate,
        buttons: newButtons
      }
    });
  };

  const updateButton = (index: number, updates: Partial<MessageButton>) => {
    if (!formData.dmTemplate) return;
    
    const newButtons = [...formData.dmTemplate.buttons];
    newButtons[index] = { ...newButtons[index], ...updates };
    
    setFormData({
      ...formData,
      dmTemplate: {
        ...formData.dmTemplate,
        buttons: newButtons
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useExistingRule && selectedRuleId && postId) {
      const selectedRule = automationRules.find(rule => rule.id === selectedRuleId);
      if (selectedRule) {
        const newRule: AutomationRule = {
          ...selectedRule,
          id: crypto.randomUUID(),
          postId,
        };
        addAutomationRule(newRule);
      }
    } else if (existingRule) {
      updateAutomationRule(existingRule.id, formData);
    } else {
      const newRule: AutomationRule = {
        id: crypto.randomUUID(),
        ...(postId && { postId }),
        ...formData as Omit<AutomationRule, 'id'>,
      };
      addAutomationRule(newRule);
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            {existingRule ? "Edit Rule" : "Create Rule"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingRule ? "Edit Automation Rule" : "Create Automation Rule"}
          </DialogTitle>
          <DialogDescription>
            {postId 
              ? "Set up automated responses for this specific post"
              : "Create a global automation rule for all posts"
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {postId && globalRules.length > 0 && !existingRule && (
            <div className="space-y-2 pb-4 border-b">
              <div className="flex items-center justify-between">
                <Label>Use Existing Rule</Label>
                <Switch
                  checked={useExistingRule}
                  onCheckedChange={setUseExistingRule}
                />
              </div>
              {useExistingRule && (
                <Select
                  value={selectedRuleId}
                  onValueChange={setSelectedRuleId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rule" />
                  </SelectTrigger>
                  <SelectContent>
                    {globalRules.map(rule => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.trigger}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {!useExistingRule && (
            <>
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Word/Phrase</Label>
                <Input
                  id="trigger"
                  placeholder="e.g., price, info, help"
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="response">Auto Reply Message</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoReply"
                      checked={formData.autoReply}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, autoReply: checked })
                      }
                    />
                    <Label htmlFor="autoReply">Enable</Label>
                  </div>
                </div>
                <Textarea
                  id="response"
                  placeholder="Enter your automated response..."
                  value={formData.response}
                  onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                  required={formData.autoReply}
                  disabled={!formData.autoReply}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dmMessage">Direct Message</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendDm"
                      checked={formData.sendDm}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, sendDm: checked })
                      }
                    />
                    <Label htmlFor="sendDm">Enable</Label>
                  </div>
                </div>
                {formData.sendDm && (
                  <div className="space-y-4">
                    <Textarea
                      id="dmTemplate.text"
                      placeholder="Enter your DM message..."
                      value={formData.dmTemplate?.text}
                      onChange={(e) => setFormData({
                        ...formData,
                        dmTemplate: {
                          ...formData.dmTemplate!,
                          text: e.target.value
                        }
                      })}
                      required
                    />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Message Buttons</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addButton}
                          disabled={formData.dmTemplate?.buttons.length === 3}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Button
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {formData.dmTemplate?.buttons.map((button, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label>Button {index + 1}</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeButton(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Input
                                  placeholder="Button Title"
                                  value={button.title}
                                  onChange={(e) => updateButton(index, { title: e.target.value })}
                                  required
                                />
                                <Input
                                  type="url"
                                  placeholder="Button URL"
                                  value={button.url}
                                  onChange={(e) => updateButton(index, { url: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionUrl">Action URL</Label>
                <Input
                  id="actionUrl"
                  type="url"
                  placeholder="https://..."
                  value={formData.actionUrl}
                  onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {existingRule ? "Update" : useExistingRule ? "Apply Rule" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}