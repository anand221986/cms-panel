import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner"
import CMSLayout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Image,
  Palette,
  Type,
  Save,
  Globe,
  Code,
  Share2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WebsiteSettings = () => {
  const [primaryColor, setPrimaryColor] = useState("#e91e8c");
  const [secondaryColor, setSecondaryColor] = useState("#9b59b6");
  const [fontFamily, setFontFamily] = useState("");
  const [fontSize, setFontSize] = useState("16");
  const [siteName, setSiteName] = useState("");
  const [siteTagline, setSiteTagline] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [favicon, setFavicon] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [googleAnalytics, setGoogleAnalytics] = useState("");
  const [facebookPixel, setFacebookPixel] = useState("");
  const [customHeadCode, setCustomHeadCode] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");

   const [contactno, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
const [settings, setSettings] = useState({
  logo_url: "",
  primary_color: "#2563eb",
  secondary_color: "#9333ea",
  font_family: "Inter",
  base_font_size: "16px",
});
const [logoFile, setLogoFile] = useState<File | null>(null);

useEffect(() => {
  fetchSettings();
}, []);

/* ---------------- FETCH SETTINGS ---------------- */
const fetchSettings = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/website-settings`);

    if (data?.status && data?.result) {

      const result = data.result;

      /* existing */
      setSettings({
        logo_url: result.logo_url || "",
        primary_color: result.primary_color || "#2563eb",
        secondary_color: result.secondary_color || "#9333ea",
        font_family: result.font_family || "Inter",
        base_font_size: result.base_font_size || "16px",
      });

      /* theme */
      setPrimaryColor(result.primary_color || "#2563eb");
      setSecondaryColor(result.secondary_color || "#9333ea");

      /* typography */
      setFontFamily(result.font_family?.toLowerCase() || "inter");
      setFontSize(result.base_font_size?.replace("px", "") || "16");

      /* general info */
      setSiteName(result.site_name || "");
      setSiteTagline(result.site_tagline || "");
      setMetaDescription(result.meta_description || "");

      /* social */
      setSocialFacebook(result.social_facebook || "");
      setSocialTwitter(result.social_twitter || "");
      setSocialInstagram(result.social_instagram || "");
      setSocialLinkedin(result.social_linkedin || "");

      /* contact info */
      setContactNo(result.contact_number || "");
      setEmail(result.email || "");
      setAddress(result.address || "");

      /* tracking */
      setGoogleAnalytics(result.google_analytics || "");
      setFacebookPixel(result.facebook_pixel || "");
      setCustomHeadCode(result.custom_head_code || "");

    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to load website settings");
  }
};
  // ✅ API INTEGRATION
   const handleSave = async () => {
    try {
      const formData = new FormData();

      if (logoFile) {
        formData.append("logo", logoFile);
      }
 if (favicon) {
      formData.append("favicon", favicon);
    }
      formData.append("primary_color", settings.primary_color);
      formData.append("secondary_color", settings.secondary_color);
      formData.append("font_family", settings.font_family);
      formData.append("base_font_size", settings.base_font_size);
      /* ---------- GENERAL INFO ---------- */
    formData.append("site_name", siteName);
    formData.append("site_tagline", siteTagline);
    formData.append("meta_description", metaDescription);

    /* ---------- SOCIAL ---------- */
    formData.append("social_facebook", socialFacebook);
    formData.append("social_twitter", socialTwitter);
    formData.append("social_instagram", socialInstagram);
    formData.append("social_linkedin", socialLinkedin);
      /* ---------- CONTACT INFO ---------- */
    formData.append("contact_number", contactno);
    formData.append("email", email);
    formData.append("address", address);

    /* ---------- TRACKING ---------- */
    formData.append("google_analytics", googleAnalytics);
    formData.append("facebook_pixel", facebookPixel);
    formData.append("custom_head_code", customHeadCode);

      const { data } = await axios.put(
        `${API_BASE_URL}/website-settings`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.status) {
        toast.success("Website settings updated successfully");

        // Update logo_url immediately if API returns it
        if (data.result?.logo_url) {
          setSettings((prev) => ({
            ...prev,
            logo_url: data.result.logo_url,
          }));
          setLogoFile(null);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save website settings");
    }
  };


  return (
    <CMSLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Website Settings
        </h1>

        {/* Website Logo */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Image className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Website Logo</h2>
          </div>

          <div className="space-y-4">
          <div>
  <Label>Upload Logo</Label>
  <Input
    type="file"
    accept="image/*"
   onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
  />

  {settings.logo_url && (
    <img
      src={settings.logo_url}
      className="h-16 mt-2"
    />
  )}
</div>
            <div>
              <Label>Upload Favicon</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFavicon(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* General Info */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">
              General Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Site Name</Label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div>
              <Label>Site Tagline</Label>
              <Input
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Site Description</Label>
              <Textarea
                value={metaDescription}
                onChange={(e) =>
                  setMetaDescription(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* other sections remain SAME (theme, typography, social, tracking) */}
               <Separator className="my-6" />

        {/* Theme Colors */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Theme Colors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Primary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-28"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-28"
                />
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Typography */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Typography</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="opensans">Open Sans</SelectItem>
                  <SelectItem value="lato">Lato</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                  <SelectItem value="montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Base Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">Small (14px)</SelectItem>
                  <SelectItem value="16">Default (16px)</SelectItem>
                  <SelectItem value="18">Large (18px)</SelectItem>
                  <SelectItem value="20">Extra Large (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
 
    

        <Separator className="my-6" />
        
        {/* Social Media Links */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Social Media Links</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Facebook</Label>
              <Input placeholder="https://facebook.com/..." value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Twitter / X</Label>
              <Input placeholder="https://twitter.com/..." value={socialTwitter} onChange={(e) => setSocialTwitter(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Instagram</Label>
              <Input placeholder="https://instagram.com/..." value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">LinkedIn</Label>
              <Input placeholder="https://linkedin.com/..." value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)} />
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Tracking & Custom Code */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-lg font-semibold text-foreground">Website Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Contact Number</Label>
              <Input placeholder="contact" value={contactno} onChange={(e) => setContactNo(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Email ID</Label>
              <Input placeholder="123456789" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Address</Label>
              <Textarea
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Tracking & Custom Code */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Code className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Tracking & Custom Code</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Google Analytics ID</Label>
              <Input placeholder="G-XXXXXXXXXX" value={googleAnalytics} onChange={(e) => setGoogleAnalytics(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Facebook Pixel ID</Label>
              <Input placeholder="123456789" value={facebookPixel} onChange={(e) => setFacebookPixel(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Custom Head Code</Label>
              <Textarea
                placeholder="<script>...</script>"
                value={customHeadCode}
                onChange={(e) => setCustomHeadCode(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Save Button */}
        <div className="flex justify-end mt-8 mb-12">
          <Button
            className="gap-2 px-6"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Website Settings"}
          </Button>
        </div>
      </div>
    </CMSLayout>
  );
};

export default WebsiteSettings;