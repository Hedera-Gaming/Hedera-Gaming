import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle, Send, Twitter, Github } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const socialLinks = [
    { icon: <Twitter />, name: 'Twitter', handle: '@HederaNexus' },
    { icon: <MessageCircle />, name: 'Discord', handle: 'Join Our Server' },
    { icon: <Github />, name: 'GitHub', handle: 'github.com/hederanexus' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="glass-card"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="glass-card"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Tell us more..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="glass-card resize-none"
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Email Card */}
            <Card className="glass-card p-6 hover-glow">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    support@hederanexus.io
                  </p>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card className="glass-card p-6">
              <h3 className="font-bold mb-4">Connect With Us</h3>
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="glass"
                    className="w-full justify-start hover-glow"
                  >
                    <span className="mr-3">{link.icon}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium">{link.name}</p>
                      <p className="text-xs text-muted-foreground">{link.handle}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* FAQ Hint */}
            <Card className="glass-card p-6 border-primary/30">
              <h3 className="font-bold mb-2">Need Quick Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check out our FAQ section for common questions and answers.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View FAQ
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
