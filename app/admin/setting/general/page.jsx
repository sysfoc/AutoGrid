"use client";
import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [activeSection, setActiveSection] = useState("Logo");
  const [selectedLogoForEdit, setSelectedLogoForEdit] = useState("logo1"); // New state for logo selection
  const [settings, setSettings] = useState({
    logo1: "", // New logo fields
    logo2: "",
    logo3: "",
    activeWebsiteLogo: "logo1", // New field for active logo
    favicon: "",
    top: {
      hideDarkMode: false,
      hideFavourite: false,
      hideLogo: false,
    },
    footer: {
      col1Heading: "",
      col2Heading: "",
      col3Heading: "",
    },
    recaptcha: {
      siteKey: "",
      status: "inactive",
    },
    analytics: {
      trackingId: "",
      status: "inactive",
    },
    cookieConsent: {
      message: "",
      buttonText: "ACCEPT",
      textColor: "#000000",
      bgColor: "#ffffff",
      buttonTextColor: "#ffffff",
      buttonBgColor: "#000000",
      status: "inactive",
    },
    themeColor: {
      darkModeBg: "#000000",
      darkModeText: "#ffffff",
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/settings/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to save settings: ${errorData.message || errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings/general');
        const data = await response.json();
        if (data.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings,
            top: { ...prev.top, ...(data.settings.top || {}) },
            footer: { ...prev.footer, ...(data.settings.footer || {}) },
            recaptcha: { ...prev.recaptcha, ...(data.settings.recaptcha || {}) },
            analytics: { ...prev.analytics, ...(data.settings.analytics || {}) },
            cookieConsent: {
              ...prev.cookieConsent,
              ...(data.settings.cookieConsent || {})
            },
            themeColor: {
              ...prev.themeColor,
              ...(data.settings.themeColor || {})
            },
            // Ensure new logo fields are populated, defaulting to empty string if not present
            logo1: data.settings.logo1 || "",
            logo2: data.settings.logo2 || "",
            logo3: data.settings.logo3 || "",
            activeWebsiteLogo: data.settings.activeWebsiteLogo || "logo1", // Default to logo1
            favicon: data.settings.favicon || "",
          }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = async (type, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSettings(prev => ({
          ...prev,
          [type]: reader.result // 'type' will be 'logo1', 'logo2', 'logo3', or 'favicon'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  General Settings
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Manage your website global settings and configurations
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="font-semibold px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base w-full sm:w-auto"
                  onClick={handleSubmit}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-slate-200">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h2 className="font-semibold text-slate-700">Configuration Sections</h2>
              </div>
              {[
                "Logo",
                "Favicon",
                "Top",
                "Footer",
                "Google Recaptcha",
                "Google Analytics",
                "Cookie Consent",
                "Theme Colors",
              ].map((section) => (
                <div
                  key={section}
                  className={`p-4 cursor-pointer transition-colors duration-200 ${
                    activeSection === section
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  <div className="flex items-center">
                    <span>{section}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Main Content */}
            <div className="w-full md:w-3/4 p-6">
              <div className="max-w-3xl mx-auto">
                {activeSection === "Logo" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Logo Settings</h3>
                    <div>
                      <Label htmlFor="select-logo" className="block mb-2 font-medium text-slate-700">
                        Select Logo to Edit
                      </Label>
                      <Select
                        id="select-logo"
                        value={selectedLogoForEdit}
                        onChange={(e) => setSelectedLogoForEdit(e.target.value)}
                        className="w-full"
                      >
                        <option value="logo1">Wind Screen</option>
                        <option value="logo2">Front Seat</option>
                        <option value="logo3">Cruise Control</option>
                      </Select>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Label className="block mb-2 font-medium text-slate-700">Existing Logo</Label>
                      <div className="relative w-32 h-32 mx-auto border border-slate-200 rounded-lg overflow-hidden bg-white">
                        {settings[selectedLogoForEdit] ? (
                          <Image
                            fill
                            alt={`${selectedLogoForEdit} logo`}
                            src={settings[selectedLogoForEdit] || "/placeholder.svg"}
                            className="object-contain p-3"
                            sizes="(max-width: 768px) 100vw, 150px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">No Logo</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="logo-upload" className="block mb-2 font-medium text-slate-700">
                        Upload New {selectedLogoForEdit === 'logo1' ? 'Website 1 Logo' : selectedLogoForEdit === 'logo2' ? 'Website 2 Logo' : 'Website 3 Logo'}
                      </Label>
                      <FileInput
                        id="logo-upload"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => handleFileChange(selectedLogoForEdit, e)}
                      />
                      <p className="mt-1 text-sm text-slate-500">
                        Recommended size: 300x100px (transparent PNG preferred)
                      </p>
                    </div>
                  </div>
                )}
                {activeSection === "Favicon" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Favicon Settings</h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Label className="block mb-2 font-medium text-slate-700">Existing Favicon</Label>
                      <div className="relative w-16 h-16 mx-auto border border-slate-200 rounded-lg overflow-hidden bg-white">
                        {settings.favicon ? (
                          <Image
                            fill
                            alt="favicon"
                            src={settings.favicon || "/placeholder.svg"}
                            className="object-contain p-2"
                            sizes="(max-width: 768px) 100vw, 64px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">No Favicon</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="favicon" className="block mb-2 font-medium text-slate-700">
                        Upload New Favicon
                      </Label>
                      <FileInput
                        id="favicon"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => handleFileChange('favicon', e)}
                      />
                      <p className="mt-1 text-sm text-slate-500">
                        Recommended size: 64x64px (ICO or PNG format)
                      </p>
                    </div>
                  </div>
                )}
                {activeSection === "Top" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Header Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <Checkbox
                          id="darkMode"
                          checked={settings.top.hideDarkMode}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            top: {
                              ...prev.top,
                              hideDarkMode: e.target.checked
                            }
                          }))}
                        />
                        <Label htmlFor="darkMode" className="font-medium text-slate-700">
                          Hide Dark mode button from Header
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <Checkbox
                          id="favouriteBtn"
                          checked={settings.top.hideFavourite}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            top: {
                              ...prev.top,
                              hideFavourite: e.target.checked
                            }
                          }))}
                        />
                        <Label htmlFor="favouriteBtn" className="font-medium text-slate-700">
                          Hide Favourite button from Header
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <Checkbox
                          id="logoBtn"
                          checked={settings.top.hideLogo}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            top: {
                              ...prev.top,
                              hideLogo: e.target.checked
                            }
                          }))}
                        />
                        <Label htmlFor="logoBtn" className="font-medium text-slate-700">
                          Hide Logo from the Header
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === "Footer" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Footer Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="footer-col-1-heading" className="block mb-2 font-medium text-slate-700">
                          Footer Column 1 - Heading
                        </Label>
                        <TextInput
                          value={settings.footer.col1Heading}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              col1Heading: e.target.value
                            }
                          }))}
                          placeholder="About Us"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="footer-col-2-heading" className="block mb-2 font-medium text-slate-700">
                          Footer Column 2 - Heading
                        </Label>
                        <TextInput
                          value={settings.footer.col2Heading}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              col2Heading: e.target.value
                            }
                          }))}
                          placeholder="Quick Links"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="footer-col-3-heading" className="block mb-2 font-medium text-slate-700">
                          Footer Column 3 - Heading
                        </Label>
                        <TextInput
                          value={settings.footer.col3Heading}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              col3Heading: e.target.value
                            }
                          }))}
                          placeholder="Contact Us"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === "Google Recaptcha" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Google reCAPTCHA Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="recaptcha" className="block mb-2 font-medium text-slate-700">
                          Google Recaptcha Site Key
                        </Label>
                        <TextInput
                          id="recaptcha"
                          value={settings.recaptcha.siteKey}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            recaptcha: {
                              ...prev.recaptcha,
                              siteKey: e.target.value
                            }
                          }))}
                          placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                          className="w-full"
                        />
                        <p className="mt-2 text-sm text-slate-500">
                          Get your site key from the <a
                            href="https://www.google.com/recaptcha/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            reCAPTCHA admin console
                          </a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="recaptcha-status" className="block mb-2 font-medium text-slate-700">
                          Google Recaptcha Status
                        </Label>
                        <Select
                          id="recaptcha-status"
                          value={settings.recaptcha.status}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            recaptcha: {
                              ...prev.recaptcha,
                              status: e.target.value
                            }
                          }))}
                          className="w-full"
                        >
                          <option value="inactive">Inactive</option>
                          <option value="active">Active</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === "Google Analytics" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Google Analytics Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="analytic" className="block mb-2 font-medium text-slate-700">
                          Google Analytics Tracking ID
                        </Label>
                        <TextInput
                          id="analytic"
                          value={settings.analytics.trackingId}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics,
                              trackingId: e.target.value
                            }
                          }))}
                          placeholder="UA-XXXXX-Y"
                          className="w-full"
                        />
                        <p className="mt-2 text-sm text-slate-500">
                          Find your tracking ID in your <a
                            href="https://analytics.google.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            Google Analytics account
                          </a>
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="analytic-status" className="block mb-2 font-medium text-slate-700">
                          Google Analytics Status
                        </Label>
                        <Select
                          id="analytic-status"
                          value={settings.analytics.status}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics,
                              status: e.target.value
                            }
                          }))}
                          className="w-full"
                        >
                          <option value="inactive">Inactive</option>
                          <option value="active">Active</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === "Cookie Consent" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Cookie Consent Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cookie-message" className="block mb-2 font-medium text-slate-700">
                          Consent Message
                        </Label>
                        <Textarea
                          id="cookie-message"
                          value={settings.cookieConsent.message}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            cookieConsent: {
                              ...prev.cookieConsent,
                              message: e.target.value
                            }
                          }))}
                          placeholder="We use cookies to enhance your experience..."
                          rows={3}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cookie-button-text" className="block mb-2 font-medium text-slate-700">
                          Button Text
                        </Label>
                        <TextInput
                          id="cookie-button-text"
                          value={settings.cookieConsent.buttonText}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            cookieConsent: {
                              ...prev.cookieConsent,
                              buttonText: e.target.value
                            }
                          }))}
                          placeholder="Accept All"
                          className="w-full"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="block mb-2 font-medium text-slate-700">
                            Text Color
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={settings.cookieConsent.textColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  textColor: e.target.value
                                }
                              }))}
                              className="w-10 h-10 border rounded cursor-pointer"
                            />
                            <TextInput
                              value={settings.cookieConsent.textColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  textColor: e.target.value
                                }
                              }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="block mb-2 font-medium text-slate-700">
                            Background Color
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={settings.cookieConsent.bgColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  bgColor: e.target.value
                                }
                              }))}
                              className="w-10 h-10 border rounded cursor-pointer"
                            />
                            <TextInput
                              value={settings.cookieConsent.bgColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  bgColor: e.target.value
                                }
                              }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="block mb-2 font-medium text-slate-700">
                            Button Text Color
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={settings.cookieConsent.buttonTextColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  buttonTextColor: e.target.value
                                }
                              }))}
                              className="w-10 h-10 border rounded cursor-pointer"
                            />
                            <TextInput
                              value={settings.cookieConsent.buttonTextColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  buttonTextColor: e.target.value
                                }
                              }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="block mb-2 font-medium text-slate-700">
                            Button Background Color
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={settings.cookieConsent.buttonBgColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  buttonBgColor: e.target.value
                                }
                              }))}
                              className="w-10 h-10 border rounded cursor-pointer"
                            />
                            <TextInput
                              value={settings.cookieConsent.buttonBgColor}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                cookieConsent: {
                                  ...prev.cookieConsent,
                                  buttonBgColor: e.target.value
                                }
                              }))}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cookie-consent-status" className="block mb-2 font-medium text-slate-700">
                          Cookie Consent Status
                        </Label>
                        <Select
                          id="cookie-consent-status"
                          value={settings.cookieConsent.status}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            cookieConsent: {
                              ...prev.cookieConsent,
                              status: e.target.value
                            }
                          }))}
                          className="w-full"
                        >
                          <option value="inactive">Inactive</option>
                          <option value="active">Active</option>
                        </Select>
                      </div>
                      <div className="mt-6">
                        <Label className="block mb-2 font-medium text-slate-700">Preview</Label>
                        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                          <div
                            className="p-4 rounded-lg shadow-sm"
                            style={{
                              backgroundColor: settings.cookieConsent.bgColor,
                              color: settings.cookieConsent.textColor,
                            }}
                          >
                            <div className="font-medium mb-2">
                              {settings.cookieConsent.message || 'We use cookies to enhance your experience'}
                            </div>
                            <div className="text-sm mb-4 opacity-80">
                              We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience.
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button
                                className="px-4 py-2 text-sm rounded transition-colors"
                                style={{
                                  backgroundColor: settings.cookieConsent.buttonBgColor,
                                  color: settings.cookieConsent.buttonTextColor,
                                }}
                              >
                                Reject All
                              </button>
                              <button
                                className="px-4 py-2 text-sm rounded font-medium transition-colors"
                                style={{
                                  backgroundColor: settings.cookieConsent.buttonBgColor,
                                  color: settings.cookieConsent.buttonTextColor,
                                }}
                              >
                                {settings.cookieConsent.buttonText || 'Accept All'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === "Theme Colors" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Theme Color Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dark-mode-bg-color" className="block mb-2 font-medium text-slate-700">
                          Dark Mode Background Color
                        </Label>
                        <div className="flex items-center gap-3">
                          <input
                            id="dark-mode-bg-color"
                            type="color"
                            value={settings.themeColor.darkModeBg}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              themeColor: {
                                ...prev.themeColor,
                                darkModeBg: e.target.value
                              }
                            }))}
                            className="w-12 h-12 border rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <TextInput
                              value={settings.themeColor.darkModeBg}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                themeColor: {
                                  ...prev.themeColor,
                                  darkModeBg: e.target.value
                                }
                              }))}
                              className="w-full"
                            />
                            <p className="mt-1 text-sm text-slate-500">
                              Hex code for the dark mode background
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dark-mode-text-color" className="block mb-2 font-medium text-slate-700">
                          Dark Mode Text Color
                        </Label>
                        <div className="flex items-center gap-3">
                          <input
                            id="dark-mode-text-color"
                            type="color"
                            value={settings.themeColor.darkModeText}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              themeColor: {
                                ...prev.themeColor,
                                darkModeText: e.target.value
                              }
                            }))}
                            className="w-12 h-12 border rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <TextInput
                              value={settings.themeColor.darkModeText}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                themeColor: {
                                  ...prev.themeColor,
                                  darkModeText: e.target.value
                                }
                              }))}
                              className="w-full"
                            />
                            <p className="mt-1 text-sm text-slate-500">
                              Hex code for the dark mode text
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* {activeSection === "Active Website Logo" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-800">Active Website Logo Selection</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="active-logo-select" className="block mb-2 font-medium text-slate-700">
                          Select Active Logo for Frontend
                        </Label>
                        <Select
                          id="active-logo-select"
                          value={settings.activeWebsiteLogo}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            activeWebsiteLogo: e.target.value
                          }))}
                          className="w-full"
                        >
                          <option value="logo1">Website 1 Logo</option>
                          <option value="logo2">Website 2 Logo</option>
                          <option value="logo3">Website 3 Logo</option>
                        </Select>
                        <p className="mt-2 text-sm text-slate-500">
                          This logo will be displayed on the main website header.
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <Label className="block mb-2 font-medium text-slate-700">Preview Active Logo</Label>
                        <div className="relative w-32 h-32 mx-auto border border-slate-200 rounded-lg overflow-hidden bg-white">
                          {settings[settings.activeWebsiteLogo] ? (
                            <Image
                              fill
                              alt="Active Website Logo"
                              src={settings[settings.activeWebsiteLogo] || "/placeholder.svg"}
                              className="object-contain p-3"
                              sizes="(max-width: 768px) 100vw, 150px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">No Active Logo Set</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;