"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function ThemeShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Theme Showcase</h1>
          <p className="text-lg text-muted-foreground">
            Explore our custom theme system with Light, Dark, Blue, and Red themes
          </p>
          <div className="flex justify-center">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Primary colors and semantic colors for each theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="w-full h-20 bg-primary rounded-lg"></div>
                <p className="text-sm text-muted-foreground">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-secondary rounded-lg"></div>
                <p className="text-sm text-muted-foreground">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-accent rounded-lg"></div>
                <p className="text-sm text-muted-foreground">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-destructive rounded-lg"></div>
                <p className="text-sm text-muted-foreground">Destructive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components Showcase */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Error</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gradients */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Gradients</CardTitle>
            <CardDescription>
              Custom gradients for each theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="w-full h-24 primary-gradient rounded-lg"></div>
                <p className="text-sm text-muted-foreground">Primary Gradient</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-24 blue-gradient rounded-lg"></div>
                <p className="text-sm text-muted-foreground">Blue Gradient</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-24 red-gradient rounded-lg"></div>
                <p className="text-sm text-muted-foreground">Red Gradient</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>
              Text styles and hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
            <h2 className="text-3xl font-semibold text-foreground">Heading 2</h2>
            <h3 className="text-2xl font-medium text-foreground">Heading 3</h3>
            <p className="text-lg text-foreground">Large paragraph text with normal weight</p>
            <p className="text-base text-muted-foreground">
              Regular paragraph text with muted color for secondary information
            </p>
            <p className="text-sm text-muted-foreground">
              Small text for captions and metadata
            </p>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>
              Input fields and interactive elements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Input Field</label>
                <input 
                  type="text" 
                  placeholder="Enter text..." 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Field</label>
                <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
