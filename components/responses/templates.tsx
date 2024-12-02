"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Plus, MessageSquare, Wand2, Link } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MessageButton, DMTemplate } from "@/lib/instagram/types";

interface Template {
  id: string;
  name: string;
  content: string;
  usage: number;
  category: string;
  suggestedQuestions?: string[];
  dmTemplate?: DMTemplate;
  sendDm?: boolean;
}

const defaultTemplates: Template[] = [
  {
    id: "1",
    name: "Welcome Message",
    content: "Thanks for your comment! We appreciate your engagement! 🙌",
    usage: 234,
    category: "Greeting",
    suggestedQuestions: [
      "Hi! 👋",
      "Hello there!",
      "Hey!"
    ]
  },
  {
    id: "2",
    name: "Product Inquiry",
    content: "Thank you for your interest! Please check our website for pricing details at {website} or DM us for a personalized quote.",
    usage: 156,
    category: "Sales",
    suggestedQuestions: [
      "How much does it cost?",
      "What's the price?",
      "Do you ship internationally?",
      "Can I get a quote?"
    ],
    sendDm: true,
    dmTemplate: {
      template_type: "button",
      text: "Here are some helpful links about our products:",
      buttons: [
        {
          type: "web_url",
          title: "View Catalog",
          url: "https://example.com/catalog"
        },
        {
          type: "web_url",
          title: "Pricing",
          url: "https://example.com/pricing"
        }
      ]
    }
  },
];

export function ResponseTemplates() {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  const categories = [
    "Greeting",
    "Sales",
    "Support",
    "FAQ",
    "Feedback",
    "Custom"
  ];

  const addButton = (template: Template) => {
    if (!template.dmTemplate || template.dmTemplate.buttons.length >= 3) return;
    
    const updatedTemplate = {
      ...template,
      dmTemplate: {
        ...template.dmTemplate,
        buttons: [
          ...template.dmTemplate.buttons,
          { type: 'web_url', title: '', url: '' }
        ]
      }
    };
    setCurrentTemplate(updatedTemplate);
  };

  const removeButton = (template: Template, index: number) => {
    if (!template.dmTemplate) return;
    
    const newButtons = [...template.dmTemplate.buttons];
    newButtons.splice(index, 1);
    
    const updatedTemplate = {
      ...template,
      dmTemplate: {
        ...template.dmTemplate,
        buttons: newButtons
      }
    };
    setCurrentTemplate(updatedTemplate);
  };

  const updateButton = (template: Template, index: number, updates: Partial<MessageButton>) => {
    if (!template.dmTemplate) return;
    
    const newButtons = [...template.dmTemplate.buttons];
    newButtons[index] = { ...newButtons[index], ...updates };
    
    const updatedTemplate = {
      ...template,
      dmTemplate: {
        ...template.dmTemplate,
        buttons: newButtons
      }
    };
    setCurrentTemplate(updatedTemplate);
  };

  const handleSave = (template: Template) => {
    if (template.id) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates([...templates, { ...template, id: crypto.randomUUID(), usage: 0 }]);
    }
    setIsEditing(false);
    setCurrentTemplate(null);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const generateSuggestedQuestions = (template: Template) => {
    // This is where you could integrate with an AI service to generate relevant questions
    const defaultQuestions = [
      "What are your business hours?",
      "Do you offer delivery?",
      "What payment methods do you accept?",
      "Where are you located?"
    ];
    
    return defaultQuestions;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Response Templates</h2>
          <p className="text-muted-foreground mt-1">
            Create and manage automated response templates
          </p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentTemplate(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{currentTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
              <DialogDescription>
                Create a response template with suggested questions and DM options.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const template: Template = {
                id: currentTemplate?.id || "",
                name: formData.get("name") as string,
                content: formData.get("content") as string,
                category: formData.get("category") as string,
                usage: currentTemplate?.usage || 0,
                suggestedQuestions: formData.get("suggestedQuestions")?.toString().split("\n").filter(q => q.trim()) || [],
                sendDm: currentTemplate?.sendDm || false,
                dmTemplate: currentTemplate?.dmTemplate
              };
              handleSave(template);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentTemplate?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={currentTemplate?.category || "Custom"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Response Message</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={currentTemplate?.content}
                  rows={4}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Use {"{variable}"} for dynamic content
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="suggestedQuestions">Suggested Questions</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const questions = generateSuggestedQuestions(currentTemplate || { id: "", name: "", content: "", category: "", usage: 0 });
                      const textarea = document.getElementById("suggestedQuestions") as HTMLTextAreaElement;
                      textarea.value = questions.join("\n");
                    }}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <Textarea
                  id="suggestedQuestions"
                  name="suggestedQuestions"
                  defaultValue={currentTemplate?.suggestedQuestions?.join("\n")}
                  rows={4}
                  placeholder="Enter each question on a new line"
                />
                <p className="text-sm text-muted-foreground">
                  Add questions that customers might ask to trigger this response
                </p>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sendDm">Send DM</Label>
                  <Switch
                    id="sendDm"
                    checked={currentTemplate?.sendDm}
                    onCheckedChange={(checked) => {
                      const updatedTemplate = {
                        ...currentTemplate!,
                        sendDm: checked,
                        dmTemplate: checked ? {
                          template_type: "button",
                          text: "",
                          buttons: []
                        } : undefined
                      };
                      setCurrentTemplate(updatedTemplate);
                    }}
                  />
                </div>

                {currentTemplate?.sendDm && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>DM Message</Label>
                      <Textarea
                        id="dmTemplate.text"
                        placeholder="Enter your DM message..."
                        value={currentTemplate.dmTemplate?.text}
                        onChange={(e) => {
                          const updatedTemplate = {
                            ...currentTemplate,
                            dmTemplate: {
                              ...currentTemplate.dmTemplate!,
                              text: e.target.value
                            }
                          };
                          setCurrentTemplate(updatedTemplate);
                        }}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Message Buttons</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addButton(currentTemplate)}
                          disabled={currentTemplate.dmTemplate?.buttons.length === 3}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Button
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {currentTemplate.dmTemplate?.buttons.map((button, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label>Button {index + 1}</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeButton(currentTemplate, index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Input
                                  placeholder="Button Title"
                                  value={button.title}
                                  onChange={(e) => updateButton(currentTemplate, index, { title: e.target.value })}
                                  required
                                />
                                <Input
                                  type="url"
                                  placeholder="Button URL"
                                  value={button.url}
                                  onChange={(e) => updateButton(currentTemplate, index, { url: e.target.value })}
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

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {currentTemplate ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">{template.name}</CardTitle>
                  <CardDescription>Used {template.usage} times</CardDescription>
                </div>
                <Badge>{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Response Message:</h4>
                  <p className="text-sm text-muted-foreground">{template.content}</p>
                </div>

                {template.suggestedQuestions && template.suggestedQuestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Questions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.suggestedQuestions.map((question, index) => (
                        <Badge key={index} variant="secondary">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {template.sendDm && template.dmTemplate && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">DM Template:</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{template.dmTemplate.text}</p>
                      <div className="flex flex-wrap gap-2">
                        {template.dmTemplate.buttons.map((button, index) => (
                          <Badge key={index} variant="outline">
                            <Link className="h-3 w-3 mr-1" />
                            {button.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentTemplate(template);
                      setIsEditing(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}