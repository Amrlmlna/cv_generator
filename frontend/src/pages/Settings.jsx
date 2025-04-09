"use client";

import { useState } from "react";
import { SettingsIcon, Bell, Lock, Eye, Moon } from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <SettingsIcon className="mr-2" size={20} />
          General Settings
        </h2>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-md">
                <Bell className="text-primary-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900">
                  Notifications
                </h3>
                <p className="text-sm text-secondary-600">
                  Receive email notifications about your account activity
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-md">
                <Moon className="text-primary-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900">Dark Mode</h3>
                <p className="text-sm text-secondary-600">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-md">
                <Lock className="text-primary-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-secondary-600">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={twoFactorAuth}
                onChange={() => setTwoFactorAuth(!twoFactorAuth)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Eye className="mr-2" size={20} />
          Privacy Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
            <div>
              <h3 className="font-medium text-secondary-900">
                Profile Visibility
              </h3>
              <p className="text-sm text-secondary-600">
                Control who can see your profile information
              </p>
            </div>
            <select className="input py-1 px-3 w-32">
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-secondary-900">CV Visibility</h3>
              <p className="text-sm text-secondary-600">
                Control who can see your uploaded CVs
              </p>
            </div>
            <select className="input py-1 px-3 w-32">
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="recruiters">Recruiters Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;
