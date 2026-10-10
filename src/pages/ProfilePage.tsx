import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  User,
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  GraduationCap,
  Save,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, resume, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [education, setEducation] = useState('B.Tech Undergrad');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('Electronics & Communication Engineering (ECE)');
  const [preferredJobRole, setPreferredJobRole] = useState('Embedded Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher / Final Year Undergrad');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [careerObjective, setCareerObjective] = useState('');

  // Resume state
  const [uploadLoading, setUploadLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resumeTextPasted, setResumeTextPasted] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setAge(profile.age || '');
      setEducation(profile.education || 'B.Tech Undergrad');
      setCollege(profile.college || '');
      setDegree(profile.degree || 'Electronics & Communication Engineering (ECE)');
      setPreferredJobRole(profile.preferredJobRole || 'Embedded Software Engineer');
      setExperienceLevel(profile.experienceLevel || 'Fresher / Final Year Undergrad');
      setSkills(profile.skills || []);
      setCareerObjective(profile.careerObjective || '');
    }
  }, [profile]);

  // Profile completion calculation
  const calculateCompletion = () => {
    let score = 0;
    if (fullName) score += 15;
    if (college) score += 15;
    if (degree) score += 15;
    if (preferredJobRole) score += 15;
    if (skills.length > 0) score += 20;
    if (resume) score += 20;
    return Math.min(100, score);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const finalRole = preferredJobRole === 'Other' ? customRole : preferredJobRole;
      await api.updateProfile({
        fullName,
        age: age ? Number(age) : undefined,
        education,
        college,
        degree,
        preferredJobRole: finalRole,
        experienceLevel,
        skills,
        careerObjective,
      });
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save profile changes.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10MB limit.');
      return;
    }

    setUploadLoading(true);
    setErrorMsg(null);

    try {
      // Read file content text
      const text = await file.text();
      // If binary PDF/DOCX, provide an extracted preview or fallback text
      const content = text.replace(/[^\x20-\x7E\t\r\n]/g, ' ').slice(0, 15000);

      await api.uploadResume({
        fileName: file.name,
        extractedText: content.trim() || `Resume text for ${file.name}. Experience with ${skills.join(', ')}.`,
      });
      await refreshProfile();
      setSaveSuccess(true);
    } catch (err: any) {
      setErrorMsg('Could not read or parse resume file. Try pasting text directly.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handlePastedResumeSubmit = async () => {
    if (!resumeTextPasted.trim()) return;
    setUploadLoading(true);
    setErrorMsg(null);

    try {
      await api.uploadResume({
        fileName: 'Pasted_Resume_Text.txt',
        extractedText: resumeTextPasted.trim(),
      });
      await refreshProfile();
      setShowPasteModal(false);
      setResumeTextPasted('');
      setSaveSuccess(true);
    } catch (err: any) {
      setErrorMsg('Failed to process pasted resume.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (confirm('Are you sure you want to remove your resume?')) {
      try {
        await api.deleteResume();
        await refreshProfile();
      } catch (err: any) {
        setErrorMsg('Failed to delete resume.');
      }
    }
  };

  const completion = calculateCompletion();

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Page Title & Profile Completion */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidate Profile & Resume</h1>
            <p className="text-xs text-slate-500 mt-1">
              Personalize your college placement interview simulations with your target role and project history.
            </p>
          </div>

          <div className="w-full sm:w-64 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-700">Profile Completion</span>
              <span className="text-[#635BFF] font-mono">{completion}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-[#635BFF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and resume updated successfully!</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Form */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-[#635BFF]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Academic & Placement Info</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Optional)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="21"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. NIT Trichy / Anna University / VIT"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree & Branch</label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              >
                <option value="Electronics & Communication Engineering (ECE)">Electronics & Communication (ECE)</option>
                <option value="Electrical & Electronics Engineering (EEE)">Electrical & Electronics (EEE)</option>
                <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="Mechanical / Core Engineering">Mechanical / Core Engineering</option>
                <option value="MCA / MSc Computer Science">MCA / MSc Computer Science</option>
              </select>
            </div>
          </div>

          {/* Job Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Placement Role</label>
            <select
              value={preferredJobRole}
              onChange={(e) => setPreferredJobRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            >
              <optgroup label="ECE & Core Electronics Tracks">
                <option value="Embedded Software Engineer">Embedded Software Engineer (STM32 / RTOS)</option>
                <option value="VLSI Design Engineer">VLSI Design Engineer (Verilog / STA)</option>
                <option value="Firmware Development Engineer">Firmware Development Engineer (C / Drivers)</option>
                <option value="IoT & Hardware Systems Engineer">IoT & Hardware Systems Engineer</option>
                <option value="Digital Signal Processing (DSP) Engineer">DSP & Communications Engineer</option>
              </optgroup>
              <optgroup label="Software & IT Tracks">
                <option value="Software Developer">Software Developer (General SDE)</option>
                <option value="Frontend Developer">Frontend Developer (React / Web)</option>
                <option value="Backend Developer">Backend Developer (Node.js / APIs)</option>
                <option value="Data Analyst">Data Analyst (SQL / Python)</option>
                <option value="Network Engineer">Network Engineer</option>
              </optgroup>
              <option value="Other">Other (Custom Role)</option>
            </select>

            {preferredJobRole === 'Other' && (
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter custom placement role title"
                className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            >
              <option value="Fresher / Final Year Undergrad">Fresher / Final Year Undergrad</option>
              <option value="Entry Level (0-1 Years Experience)">Entry Level (0-1 Years Experience)</option>
              <option value="Junior Engineer (1-2 Years Experience)">Junior Engineer (1-2 Years Experience)</option>
            </select>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Key Technical Skills & Tools</label>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-slate-300 text-slate-800 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1 mt-1 sm:mt-0">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="+ Add skill (e.g. FreeRTOS)"
                  className="px-2 py-0.5 text-xs bg-transparent border-none focus:outline-none text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="p-1 text-[#635BFF] hover:bg-indigo-50 rounded"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Career Objective */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Career Objective / Placement Goal</label>
            <textarea
              rows={3}
              value={careerObjective}
              onChange={(e) => setCareerObjective(e.target.value)}
              placeholder="e.g. Seeking an Embedded Software Engineer role at a tier-1 semiconductor or automotive firm..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg shadow-sm shadow-[#635BFF]/30 transition-all hover:scale-[1.02]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Changes</span>
          </button>
        </form>

        {/* Right Column: Resume Upload & Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#635BFF]" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Uploaded Resume</h2>
              </div>
              {resume && (
                <button
                  onClick={handleDeleteResume}
                  title="Remove resume"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {resume ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-[#635BFF]" />
                    <div>
                      <div className="font-semibold text-xs text-slate-900 truncate max-w-[200px]">
                        {resume.fileName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Parsed
                  </span>
                </div>

                {/* Parsed Information Preview */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-slate-800">Extracted Skills Grounding:</div>
                  <div className="flex flex-wrap gap-1">
                    {resume.parsedSkills.map((sk) => (
                      <span key={sk} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {resume.parsedProjects.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-800 mb-1.5">Detected Capstone / Mini Projects:</div>
                      <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                        {resume.parsedProjects.map((p, idx) => (
                          <li key={idx} className="leading-snug">{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <label className="text-xs text-[#635BFF] hover:underline font-semibold cursor-pointer">
                      Replace Resume
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasteModal(true)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                    >
                      Paste Text
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">Upload your resume (PDF, DOCX, TXT)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size 10MB</p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <label className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg cursor-pointer transition-colors shadow-xs">
                    {uploadLoading ? 'Uploading...' : 'Browse File'}
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadLoading}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasteModal(true)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Paste Text
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Placement Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
              <span>How MockWise Uses Your Resume</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              During technical rounds, the interviewer will inspect your project claims (e.g., microcontrollers used, state machine architecture, communication baud rates) to ask deep, authentic follow-up questions.
            </p>
          </div>
        </div>
      </div>

      {/* Paste Text Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Paste Resume Text</h3>
              <button onClick={() => setShowPasteModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>
            <textarea
              rows={8}
              value={resumeTextPasted}
              onChange={(e) => setResumeTextPasted(e.target.value)}
              placeholder="Paste the raw text of your resume here (education, projects, technical skills)..."
              className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePastedResumeSubmit}
                disabled={uploadLoading || !resumeTextPasted.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5248e3] rounded-lg disabled:opacity-50"
              >
                {uploadLoading ? 'Parsing...' : 'Extract & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
