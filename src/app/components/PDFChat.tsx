'use client'
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, ArrowLeftRight, Copy, Upload, FileText, FolderOpen, Home } from "lucide-react";

interface SavedFile {
  name: string;
  lastModified: string;
  type: string;
}

export default function PDFChat() {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [chat, setChat] = useState<{ question: string; answer: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [recentFiles] = useState<SavedFile[]>([
    { name: "Documento1.pdf", lastModified: "2024-02-20", type: "pdf" },
    { name: "Notas.txt", lastModified: "2024-02-19", type: "txt" },
  ]);

  const handleFile = (uploadedFile: File) => {
    if (uploadedFile) {
      setFile(uploadedFile);
      
      if (uploadedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target?.result as string);
          setFileUrl(null);
        };
        reader.readAsText(uploadedFile);
      } else {
        const url = URL.createObjectURL(uploadedFile);
        setFileUrl(url);
        setFileContent(null);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      handleFile(uploadedFile);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain')) {
      handleFile(droppedFile);
    }
  }, []);

  const renderFileContent = () => {
    if (fileUrl) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full"
          style={{ border: 'none' }}
        />
      );
    } else if (fileContent) {
      return (
        <div className="p-6 whitespace-pre-wrap font-mono text-sm">
          {fileContent}
        </div>
      );
    }
    return null;
  };

  const handleAskAI = async () => {
    if (!question) return;
    setChat([...chat, { question, answer: "Em andamento..." }]);
    setQuestion("");
  };

  const handleBackToMenu = () => {
    setFile(null);
    setFileContent(null);
    setFileUrl(null);
    setNotes("");
    setChat([]);
    setQuestion("");
  };

  const renderInitialScreen = () => (
    <div className="h-full flex items-center justify-center">
      <div className="w-[600px] space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-8">Comece sua análise</h2>
        
        {/* Área de upload */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 transition-colors
            ${isDragging 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-200 hover:border-gray-300"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
            <Upload className={`h-10 w-10 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className={`text-lg ${isDragging ? 'text-blue-600' : 'text-gray-600'}`}>
              {isDragging ? 'Solte o arquivo aqui' : 'Arraste ou clique para carregar um novo arquivo'}
            </span>
            <span className="text-sm text-gray-400">(PDF ou TXT)</span>
            <Input 
              type="file" 
              accept=".pdf,.txt" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Arquivos recentes */}
        {recentFiles.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Arquivos recentes</h3>
            <div className="space-y-2">
              {recentFiles.map((recentFile, index) => (
                <div
                  key={index}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => {/* Implementar abertura do arquivo */}}
                >
                  <div className="p-2 bg-gray-100 rounded">
                    {recentFile.type === 'pdf' ? (
                      <FileText className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FolderOpen className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{recentFile.name}</p>
                    <p className="text-sm text-gray-500">
                      Modificado em {new Date(recentFile.lastModified).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm">
                      Abrir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-4">
          {file && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToMenu}
              className="text-gray-500 hover:text-gray-900 cursor-pointer"
              title="Voltar ao menu"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold">
            {file ? file.name : 'Documentos'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <ArrowUpDown className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <ArrowLeftRight className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <Copy className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        {!file ? renderInitialScreen() : (
          <div className="grid grid-cols-2 gap-8 h-full">
            <Card className="p-0 h-full bg-white shadow-sm overflow-hidden">
              {renderFileContent()}
            </Card>
            
            <div className="flex flex-col h-full gap-6">
              <Card className="p-0 bg-white shadow-sm">
                <Textarea
                  placeholder="Adicione suas notas aqui..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] resize-none border-0 focus-visible:ring-0 p-1"
                />
              </Card>
              
              <div className="flex gap-3">
                <Input
                  placeholder="Faça uma pergunta sobre o arquivo..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 bg-white"
                />
              </div>
              <Button 
                onClick={handleAskAI}
                className="px-6 bg-black hover:bg-gray-700 text-white font-medium cursor-pointer"
              >
                Perguntar IA
              </Button>
              <div className="flex-1 space-y-4 overflow-auto">
                {chat.map((entry, index) => (
                  <Card key={index} className="p-6 bg-white shadow-sm">
                    <p className="font-medium text-gray-900 mb-3">
                      {entry.question}
                    </p>
                    <p className="text-gray-600">
                      {entry.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
