import React, { useState, useEffect, useRef, useMemo } from 'react';
import rawData from '../data.json';

// ==========================================
// INLINED CUSTOM CYBER SVG ICONS
// ==========================================
const FolderIcon = ({ open, className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <path d="M5 19h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" fill="currentColor" fillOpacity="0.15" />
    ) : (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.1" />
    )}
  </svg>
);

const FileIcon = ({ name, className }) => {
  const ext = name.split('.').pop().toLowerCase();
  
  // Custom colors based on file extension
  let color = 'currentColor';
  if (ext === 'pdf') color = '#ff3b5c';      // Danger red
  else if (ext === 'xlsx') color = '#00e699'; // Excel green
  else if (ext === 'png' || ext === 'jpg') color = '#ffaa33'; // Image gold
  else if (ext === 'yaml' || ext === 'yml') color = '#00e1ff'; // Config cyan
  
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill={color} fillOpacity="0.05" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
};

const CaretIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ShieldIcon = ({ active, className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={active ? 'currentColor' : 'none'} fillOpacity="0.1" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TerminalIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const ScanIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ==========================================
// HASH SCAN GENERATOR HELPER
// ==========================================
function getMockSHA256(filename, size) {
  let hash = 0;
  const str = filename + size;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hexChars = '0123456789abcdef';
  let result = '';
  // generate a 64 character hex string deterministically
  for (let i = 0; i < 64; i++) {
    const code = Math.abs(Math.sin(hash + i) * 10000) % 16;
    result += hexChars[Math.floor(code)];
  }
  return result;
}

// ==========================================
// RECURSIVE FILE TREE NODE COMPONENT
// ==========================================
function FileTreeNode({ 
  node, 
  depth, 
  onSelect, 
  onToggle, 
  expandedFolders, 
  selectedItemId, 
  focusedItemId,
  searchQuery
}) {
  const isFolder = node.type === 'folder';
  const isExpanded = isFolder && expandedFolders.has(node.id);
  const isSelected = selectedItemId === node.id;
  const isFocused = focusedItemId === node.id;

  // Highlight matches in the node name
  const renderNodeName = (name) => {
    if (!searchQuery) return name;
    const index = name.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return name;
    
    const before = name.substring(0, index);
    const match = name.substring(index, index + searchQuery.length);
    const after = name.substring(index + searchQuery.length);
    
    return (
      <>
        {before}
        <mark className="cyber-mark">{match}</mark>
        {after}
      </>
    );
  };

  return (
    <div className="node-wrapper" style={{ display: 'block' }}>
      <div 
        id={`node-${node.id}`}
        className={`tree-item-row ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
        style={{ paddingLeft: `${(depth * 16) + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
        tabIndex={-1}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={isFolder ? isExpanded : undefined}
      >
        {isFolder ? (
          <span 
            className={`caret-wrapper ${isExpanded ? 'expanded' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            <CaretIcon />
          </span>
        ) : (
          <span className="caret-wrapper" style={{ opacity: 0, cursor: 'default' }}>
            <CaretIcon />
          </span>
        )}
        
        <span className="node-icon">
          {isFolder ? <FolderIcon open={isExpanded} /> : <FileIcon name={node.name} />}
        </span>
        
        <span className="node-name">
          {renderNodeName(node.name)}
        </span>
      </div>

      {isFolder && isExpanded && node.children && (
        <div role="group">
          {node.children.map(child => (
            <FileTreeNode 
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              onToggle={onToggle}
              expandedFolders={expandedFolders}
              selectedItemId={selectedItemId}
              focusedItemId={focusedItemId}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  // Tree Data
  const [treeData] = useState(rawData);
  
  // Navigation & UI States
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Logger State
  const [logs, setLogs] = useState([]);
  const terminalEndRef = useRef(null);

  // Wildcard Integrity & Scanning States
  const [scanStatus, setScanStatus] = useState('idle'); // idle | scanning | verified
  const [scanProgress, setScanProgress] = useState(0);
  const [scanHash, setScanHash] = useState('');
  const scanIntervalRef = useRef(null);
  const scanProgressRef = useRef(null);

  // Decryption Download Simulation States
  const [decryptStep, setDecryptStep] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Parent mapping index for O(1) backtracking (needed for searching path auto-expansion)
  const parentMap = useMemo(() => {
    const mapping = {};
    const traverse = (node, parentId = null) => {
      if (parentId) mapping[node.id] = parentId;
      if (node.children) {
        node.children.forEach(child => traverse(child, node.id));
      }
    };
    treeData.forEach(rootNode => traverse(rootNode));
    return mapping;
  }, [treeData]);

  // Dynamic selected item resolution
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    let found = null;
    const traverse = (node) => {
      if (node.id === selectedItemId) {
        found = node;
        return;
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    treeData.forEach(traverse);
    return found;
  }, [selectedItemId, treeData]);

  // Flat representation of the data to find matching nodes
  const allNodesList = useMemo(() => {
    const list = [];
    const traverse = (node) => {
      list.push(node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    treeData.forEach(traverse);
    return list;
  }, [treeData]);

  // Logging function
  const addLog = (tag, message) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      tag,
      message
    }].slice(-100)); // Keep last 100 entries
  };

  // Log terminal automatic scroll to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Initial startup log
  useEffect(() => {
    addLog('system', 'SECUREVAULT local core initialized successfully.');
    addLog('system', 'Established secure SSL socket session over port 443.');
    addLog('security', 'AES-256-GCM cipher library loaded into hardware enclave.');
    addLog('user', 'User session authorized for principal: [joseph].');
  }, []);

  // Reset scan status on file selection change
  useEffect(() => {
    // Clear existing intervals
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (scanProgressRef.current) clearInterval(scanProgressRef.current);
    
    setScanStatus('idle');
    setScanProgress(0);
    setDecryptStep(0);
    setIsDecrypting(false);
    
    if (selectedItem) {
      setScanHash(getMockSHA256(selectedItem.name, selectedItem.size || '0KB'));
      addLog('user', `Inspecting metadata for object: ${selectedItem.name} (ID: ${selectedItem.id})`);
    }
  }, [selectedItemId]);

  // ==========================================
  // SEARCH & AUTO-EXPAND LOGIC (BONUS AC)
  // ==========================================
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const toExpand = new Set(expandedFolders);
    let matchedCount = 0;

    allNodesList.forEach(node => {
      if (node.name.toLowerCase().includes(query)) {
        matchedCount++;
        // Trace ancestors back to the root to make matching items visible
        let currentId = node.id;
        while (parentMap[currentId]) {
          const parentId = parentMap[currentId];
          toExpand.add(parentId);
          currentId = parentId;
        }
      }
    });

    if (matchedCount > 0) {
      setExpandedFolders(toExpand);
      addLog('system', `Search completed. Found ${matchedCount} matching record(s) for query: "${searchQuery}". Auto-expanding vaults.`);
    }
  }, [searchQuery, allNodesList, parentMap]);

  // Toggle single folder
  const handleToggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
        addLog('system', `Collapsing vault sector: ${folderId}`);
      } else {
        next.add(folderId);
        addLog('system', `Expanding vault sector: ${folderId}`);
      }
      return next;
    });
  };

  // Select item (mouse click)
  const handleSelectItem = (node) => {
    setSelectedItemId(node.id);
    setFocusedItemId(node.id);
  };

  // ==========================================
  // KEYBOARD ACCESSIBILITY LOGIC (STORY 3 AC)
  // ==========================================
  // Compute flat list of currently visible nodes in exact rendering order
  const visibleNodes = useMemo(() => {
    const list = [];
    const traverse = (node) => {
      // Check if node matches search (if searching, is it visible?)
      // In search mode, a node is visible if its parent chain is expanded
      list.push(node);
      if (node.type === 'folder' && expandedFolders.has(node.id) && node.children) {
        node.children.forEach(traverse);
      }
    };
    treeData.forEach(traverse);
    return list;
  }, [treeData, expandedFolders]);

  const handleKeyDown = (e) => {
    if (visibleNodes.length === 0) return;

    // Don't intercept keyboard shortcuts if search input is focused
    if (document.activeElement.tagName === 'INPUT') {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      return;
    }

    const currentIndex = visibleNodes.findIndex(node => node.id === (focusedItemId || selectedItemId));
    
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = currentIndex < visibleNodes.length - 1 ? currentIndex + 1 : 0;
        const nextNode = visibleNodes[nextIndex];
        setFocusedItemId(nextNode.id);
        scrollIntoViewIfNeeded(nextNode.id);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleNodes.length - 1;
        const prevNode = visibleNodes[prevIndex];
        setFocusedItemId(prevNode.id);
        scrollIntoViewIfNeeded(prevNode.id);
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        const currentNode = visibleNodes[currentIndex];
        if (currentNode && currentNode.type === 'folder') {
          if (!expandedFolders.has(currentNode.id)) {
            // Expand collapsed folder
            handleToggleFolder(currentNode.id);
          } else if (currentNode.children && currentNode.children.length > 0) {
            // Move to first child
            const firstChild = currentNode.children[0];
            setFocusedItemId(firstChild.id);
            scrollIntoViewIfNeeded(firstChild.id);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const currentNode = visibleNodes[currentIndex];
        if (currentNode) {
          if (currentNode.type === 'folder' && expandedFolders.has(currentNode.id)) {
            // Collapse expanded folder
            handleToggleFolder(currentNode.id);
          } else {
            // Move focus to parent folder
            const parentId = parentMap[currentNode.id];
            if (parentId) {
              setFocusedItemId(parentId);
              scrollIntoViewIfNeeded(parentId);
            }
          }
        }
        break;
      }
      case 'Enter': {
        e.preventDefault();
        const currentNode = visibleNodes[currentIndex];
        if (currentNode) {
          setSelectedItemId(currentNode.id);
          addLog('user', `Keyboard selection: Opened target item ${currentNode.name}`);
          if (currentNode.type === 'folder') {
            handleToggleFolder(currentNode.id);
          }
        }
        break;
      }
      case 'Escape': {
        setFocusedItemId(null);
        break;
      }
      default:
        break;
    }
  };

  const scrollIntoViewIfNeeded = (nodeId) => {
    setTimeout(() => {
      const el = document.getElementById(`node-${nodeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    }, 10);
  };

  // Keyboard navigation focus utility
  const handleContainerFocus = () => {
    if (!focusedItemId && visibleNodes.length > 0) {
      setFocusedItemId(visibleNodes[0].id);
    }
  };

  // ==========================================
  // WILDCARD INTEGRITY RUNNER & DECRYPTER
  // ==========================================
  // 1. Cyber SHA-256 Block Scan Animation
  const startIntegrityVerification = () => {
    if (!selectedItem || selectedItem.type !== 'file') return;
    
    setScanStatus('scanning');
    setScanProgress(0);
    addLog('security', `INTEGRITY CHECK initiated for: ${selectedItem.name}`);
    addLog('system', `Hashing blocks of size: ${selectedItem.size || '0KB'} using SHA-256 hardware accelerated enclave.`);

    const totalDuration = 2000; // 2 seconds
    const intervalTime = 50;
    const step = 100 / (totalDuration / intervalTime);
    
    // Animate scanning progress
    scanProgressRef.current = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanProgressRef.current);
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, intervalTime);

    // Scramble hash string visually
    const chars = '0123456789abcdef';
    scanIntervalRef.current = setInterval(() => {
      let scramble = '';
      for (let i = 0; i < 64; i++) {
        scramble += chars[Math.floor(Math.random() * chars.length)];
      }
      setScanHash(scramble);
    }, 40);

    // Finish scanning
    setTimeout(() => {
      clearInterval(scanIntervalRef.current);
      clearInterval(scanProgressRef.current);
      
      const verifiedHash = getMockSHA256(selectedItem.name, selectedItem.size || '0KB');
      setScanHash(verifiedHash);
      setScanStatus('verified');
      setScanProgress(100);
      
      addLog('security', `SUCCESS: SHA-256 block digest matches cryptographic signature: ${verifiedHash.substring(0, 16)}...`);
      addLog('security', `Vault File is fully secure and untampered (STATUS: 200 OK).`);
    }, totalDuration);
  };

  // 2. High-Security Decryption Simulator (Download simulator)
  const startDecryptionSequence = () => {
    if (!selectedItem || selectedItem.type !== 'file') return;
    
    setIsDecrypting(true);
    setDecryptStep(1);
    addLog('security', `ECDH handshake starting. Negotiating secure ephemeral session keys...`);

    // Step 1: DH Key Exchange
    setTimeout(() => {
      setDecryptStep(2);
      addLog('security', `ECDH exchange completed. Derived AES-256 shared secret key inside HSM.`);
      addLog('system', `Decrypting cipher text using AES-256-GCM authenticated blocks...`);
      
      // Step 2: Decrypting blocks
      setTimeout(() => {
        setDecryptStep(3);
        addLog('security', `Integrity authentication tag matches. Local plaintext extracted.`);
        addLog('system', `Injecting security audit logs. Dispatching secure file payload to user browser.`);
        
        // Step 3: Payload Complete
        setTimeout(() => {
          setIsDecrypting(false);
          setDecryptStep(4);
          addLog('user', `Payload decrypted and downloaded successfully: ${selectedItem.name}`);
          
          // Trigger actual text file payload download simulator
          const element = document.createElement("a");
          const file = new Blob([
            `SECUREVAULT CRYPTOGRAPHIC DISPATCH\n==================================\n\nFilename: ${selectedItem.name}\nSize: ${selectedItem.size || '0KB'}\nIntegrity SHA-256 Checksum: ${getMockSHA256(selectedItem.name, selectedItem.size || '0KB')}\nAudit Status: SECURE & ACCREDITED\n\nThis file is decrypted and verified on the local client using hardware security keys.`
          ], { type: 'text/plain' });
          element.href = URL.createObjectURL(file);
          element.download = selectedItem.name;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }, 1000);
      }, 1200);
    }, 1000);
  };

  return (
    <div 
      className="app-container" 
      onKeyDown={handleKeyDown}
      onFocus={handleContainerFocus}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {/* 1. CYBER HEADER */}
      <header className="cyber-header">
        <div className="brand-section">
          <div className="brand-logo-glow"></div>
          <span className="brand-title">
            SECUREVAULT <span className="brand-badge">MIL-GCM</span>
          </span>
        </div>
        <div className="sys-metrics">
          <div className="metric-item">
            <span className="metric-dot"></span>
            <span>VAULT HARDWARE HSMS: ONLINE</span>
          </div>
          <div className="metric-item" style={{ color: 'var(--accent-info)' }}>
            <span>KEY STRENGTH: AES-256</span>
          </div>
        </div>
      </header>

      {/* 2. DASHBOARD MAIN Split Pane */}
      <main className="dashboard-main">
        {/* Left Explorer Sidebar */}
        <section className="explorer-sidebar">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <div className="cyber-search-container">
              <span className="search-icon"><SearchIcon /></span>
              <input 
                type="text" 
                className="cyber-search-input"
                placeholder="Search secure vaults..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>
          </div>
          
          {/* Scrollable Tree */}
          <div className="tree-scroll-container" role="tree" aria-label="SecureVault File Tree">
            {treeData.map(node => (
              <FileTreeNode 
                key={node.id}
                node={node}
                depth={0}
                onSelect={handleSelectItem}
                onToggle={handleToggleFolder}
                expandedFolders={expandedFolders}
                selectedItemId={selectedItemId}
                focusedItemId={focusedItemId}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </section>

        {/* Center Panel (Interactive welcome and instructions grid) */}
        <section className="workspace-center">
          <div className="cyber-grid-overlay"></div>
          <div className={`center-secure-shield ${selectedItem ? 'active' : ''}`}>
            <ShieldIcon active={!!selectedItem} />
          </div>
          <h2 className="welcome-title">
            {selectedItem ? `Enclave Active: ${selectedItem.name}` : 'Enterprise Cryptographic Storage'}
          </h2>
          <p className="welcome-subtitle">
            {selectedItem 
              ? 'Hardware security modules derived. Integrity scan buffers loaded. Select operations from the right panel.' 
              : 'SecureVault encrypts financial and legal document hierarchies using client-side ECDH keys. Navigate nodes to begin.'}
          </p>

          <div className="instructions-grid">
            <div className="instruction-card">
              <h4>Keyboard Navigation</h4>
              <p>
                Use <kbd className="key-badge">▲</kbd> <kbd className="key-badge">▼</kbd> arrows to scroll nodes. Use <kbd className="key-badge">►</kbd> to expand, <kbd className="key-badge">◄</kbd> to collapse. Press <kbd className="key-badge">Enter</kbd> to select.
              </p>
            </div>
            <div className="instruction-card">
              <h4>Security Enforcer</h4>
              <p>
                Integrity checkers run client-side SHA-256 scans to ensure defense against middleman attacks.
              </p>
            </div>
          </div>

          <div className="keyboard-shortcut-hint">
            <span className="shortcut-pill">
              <kbd>UP</kbd>/<kbd>DOWN</kbd> Navigate focus
            </span>
            <span className="shortcut-pill">
              <kbd>RIGHT</kbd> Expand folder
            </span>
            <span className="shortcut-pill">
              <kbd>LEFT</kbd> Collapse / Parent folder
            </span>
            <span className="shortcut-pill">
              <kbd>ENTER</kbd> Inspect & Load file
            </span>
          </div>
        </section>

        {/* Right Inspector & Operations Panel */}
        <section className="inspector-panel">
          <div className="panel-header-badge">
            <span className="panel-title">Operations Chamber</span>
            <span className="panel-status">
              {selectedItem ? (selectedItem.type === 'folder' ? 'DIRECTORY' : 'PLAINTEXT') : 'AWAITING NODE'}
            </span>
          </div>

          {!selectedItem ? (
            <div className="empty-inspector-container">
              <span className="empty-icon"><LockIcon /></span>
              <p>No entity loaded in inspector.<br/>Select a file or folder to mount secure operations.</p>
            </div>
          ) : (
            <div className="meta-container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Basic Meta Cards */}
              <div className="meta-section">
                <div className="file-header-card">
                  <div className={`file-avatar-cube ${selectedItem.type === 'file' ? 'secure' : ''}`}>
                    {selectedItem.type === 'folder' ? <FolderIcon open={expandedFolders.has(selectedItem.id)} /> : <FileIcon name={selectedItem.name} />}
                  </div>
                  <div className="file-name-meta">
                    <h3 className="file-main-name" title={selectedItem.name}>{selectedItem.name}</h3>
                    <span className="file-sub-type">
                      {selectedItem.type === 'folder' ? 'Folder Directory' : `.${selectedItem.name.split('.').pop()} Cryptographic Object`}
                    </span>
                  </div>
                </div>

                {selectedItem.type === 'folder' ? (
                  <div className="properties-list">
                    <div className="property-row">
                      <span className="property-name">Entity ID</span>
                      <span className="property-value">{selectedItem.id}</span>
                    </div>
                    <div className="property-row">
                      <span className="property-name">Containing Nodes</span>
                      <span className="property-value">{selectedItem.children ? selectedItem.children.length : 0} items</span>
                    </div>
                    <div className="property-row">
                      <span className="property-name">Storage State</span>
                      <span className="property-value">ENCRYPTED AT REST</span>
                    </div>
                  </div>
                ) : (
                  <div className="meta-grid">
                    <div className="meta-field">
                      <span className="field-label">File Size</span>
                      <span className="field-value">{selectedItem.size || '0 KB'}</span>
                    </div>
                    <div className="meta-field">
                      <span className="field-label">Cipher Method</span>
                      <span className="field-value">AES-GCM-256</span>
                    </div>
                    <div className="meta-field" style={{ gridColumn: 'span 2' }}>
                      <span className="field-label">Object Unique Identifier</span>
                      <span className="field-value" style={{ fontSize: '0.72rem' }}>{selectedItem.id}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cryptography Chamber (Wildcard & Security Details) */}
              {selectedItem.type === 'file' && (
                <div className="crypto-section">
                  {/* Card 1: SHA-256 Integrity Verification */}
                  <div className="crypto-card-box">
                    <div className="box-title-bar">
                      <span className="box-title">
                        <span className="box-pulse-indicator" style={{ backgroundColor: scanStatus === 'verified' ? 'var(--accent-secure)' : scanStatus === 'scanning' ? 'var(--accent-info)' : 'var(--text-muted)' }}></span>
                        SHA-256 Block digest
                      </span>
                      <span className="panel-status" style={{ 
                        backgroundColor: scanStatus === 'verified' ? 'rgba(0, 230, 153, 0.1)' : scanStatus === 'scanning' ? 'rgba(0, 225, 255, 0.1)' : 'rgba(103, 109, 125, 0.1)', 
                        borderColor: scanStatus === 'verified' ? 'var(--accent-secure)' : scanStatus === 'scanning' ? 'var(--accent-info)' : 'var(--text-muted)',
                        color: scanStatus === 'verified' ? 'var(--accent-secure)' : scanStatus === 'scanning' ? 'var(--accent-info)' : 'var(--text-muted)'
                      }}>
                        {scanStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className={`hash-container ${scanStatus === 'scanning' ? 'scanning' : ''}`}>
                      {scanHash}
                    </div>

                    {scanStatus === 'scanning' && (
                      <div className="scan-progress-bar">
                        <div className="scan-progress-fill" style={{ width: `${scanProgress}%` }}></div>
                      </div>
                    )}

                    <button 
                      className={`action-cyber-btn ${scanStatus === 'verified' ? 'action-cyan-btn' : ''}`}
                      onClick={startIntegrityVerification}
                      disabled={scanStatus === 'scanning'}
                    >
                      <ScanIcon />
                      {scanStatus === 'idle' ? 'Run Cryptographic Scan' : scanStatus === 'scanning' ? 'Scanning blocks...' : 'Re-verify Hash Integrity'}
                    </button>
                  </div>

                  {/* Card 2: Interactive Enclave Download Decryption */}
                  <div className="crypto-card-box">
                    <div className="box-title-bar">
                      <span className="box-title"><LockIcon /> Hardware Key Enclave Decryptor</span>
                    </div>
                    
                    {isDecrypting && (
                      <div className="decryption-simulation-box">
                        <div className="simulation-step">
                          <span className="step-name">1. Ephemeral session ECDH handshake</span>
                          <span className={`step-status ${decryptStep === 1 ? 'active' : decryptStep > 1 ? 'done' : 'pending'}`}>
                            {decryptStep === 1 ? 'NEGOTIATING' : decryptStep > 1 ? 'ESTABLISHED' : 'WAITING'}
                          </span>
                        </div>
                        <div className="simulation-step">
                          <span className="step-name">2. Derive secret & decrypt AES blocks</span>
                          <span className={`step-status ${decryptStep === 2 ? 'active' : decryptStep > 2 ? 'done' : 'pending'}`}>
                            {decryptStep === 2 ? 'PROCESSING' : decryptStep > 2 ? 'DECRYPTED' : 'WAITING'}
                          </span>
                        </div>
                        <div className="simulation-step">
                          <span className="step-name">3. Authenticate payload & dispatch</span>
                          <span className={`step-status ${decryptStep === 3 ? 'active' : decryptStep > 3 ? 'done' : 'pending'}`}>
                            {decryptStep === 3 ? 'PREPARING' : decryptStep > 3 ? 'DISPATCHED' : 'WAITING'}
                          </span>
                        </div>
                      </div>
                    )}

                    <button 
                      className="action-cyber-btn action-cyan-btn"
                      onClick={startDecryptionSequence}
                      disabled={isDecrypting}
                    >
                      {isDecrypting ? 'Decrypting Secure Object...' : 'Secure Decrypt & Download'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* 3. BOTTOM CYBER TERMINAL ACTIVITY LOGGER */}
      <footer className="cyber-terminal">
        <div className="terminal-header">
          <div className="terminal-title-bar">
            <span className="terminal-dot-indicator"></span>
            <span className="node-icon" style={{ margin: 0 }}><TerminalIcon /></span>
            <span>SecureVault Auditing & Activity Ledger</span>
          </div>
          <div className="terminal-controls">
            <button className="terminal-control-btn" onClick={() => setLogs([])}>Clear Console</button>
          </div>
        </div>

        <div className="terminal-body">
          {logs.map(log => (
            <div key={log.id} className="log-entry">
              <span className="log-timestamp">[{log.timestamp}]</span>
              <span className={`log-tag ${log.tag}`}>{log.tag.toUpperCase()}:</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </footer>
    </div>
  );
}
