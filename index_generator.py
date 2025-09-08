import os
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import json
from pathlib import Path

class IndexFileGenerator:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("React Components Index File Generator")
        self.root.geometry("800x600")
        
        # 설정 파일 경로
        self.config_file = "index_generator_config.json"
        self.load_config()
        
        self.setup_ui()
        
    def load_config(self):
        """설정 파일 로드"""
        self.config = {
            "last_directory": "",
            "file_extensions": [".tsx", ".jsx", ".ts", ".js"],
            "export_style": "named",  # "named" or "default"
            "use_typescript": True
        }
        
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    saved_config = json.load(f)
                    self.config.update(saved_config)
            except:
                pass
    
    def save_config(self):
        """설정 파일 저장"""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
        except:
            pass
    
    def setup_ui(self):
        """UI 설정"""
        # 메인 프레임
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 폴더 선택 영역
        folder_frame = ttk.LabelFrame(main_frame, text="폴더 선택", padding="10")
        folder_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        # 선택된 폴더들을 표시할 리스트박스
        ttk.Label(folder_frame, text="선택된 폴더들:").grid(row=0, column=0, sticky=tk.W)
        
        list_frame = ttk.Frame(folder_frame)
        list_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), padx=(0, 10))
        
        self.folder_listbox = tk.Listbox(list_frame, height=4, selectmode=tk.SINGLE)
        folder_scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.folder_listbox.yview)
        self.folder_listbox.configure(yscrollcommand=folder_scrollbar.set)
        
        self.folder_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        folder_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 버튼들
        button_frame = ttk.Frame(folder_frame)
        button_frame.grid(row=1, column=1, sticky=tk.N)
        
        ttk.Button(button_frame, text="폴더 추가", command=self.add_folder).pack(pady=2)
        ttk.Button(button_frame, text="선택 제거", command=self.remove_folder).pack(pady=2)
        ttk.Button(button_frame, text="모두 제거", command=self.clear_folders).pack(pady=2)
        
        folder_frame.columnconfigure(0, weight=1)
        list_frame.columnconfigure(0, weight=1)
        
        # 선택된 폴더들 저장할 리스트
        self.selected_folders = []
        
        # 설정 영역
        settings_frame = ttk.LabelFrame(main_frame, text="설정", padding="10")
        settings_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        # TypeScript/JavaScript 선택
        self.use_typescript = tk.BooleanVar(value=self.config["use_typescript"])
        ttk.Checkbutton(settings_frame, text="TypeScript 사용 (.ts/.tsx)", variable=self.use_typescript).grid(row=0, column=0, sticky=tk.W)
        
        # Export 스타일 선택
        ttk.Label(settings_frame, text="Export 스타일:").grid(row=1, column=0, sticky=tk.W, pady=(10, 0))
        self.export_style = tk.StringVar(value=self.config["export_style"])
        ttk.Radiobutton(settings_frame, text="Named exports (export { Component })", variable=self.export_style, value="named").grid(row=2, column=0, sticky=tk.W)
        ttk.Radiobutton(settings_frame, text="Re-exports (export * from './Component')", variable=self.export_style, value="reexport").grid(row=3, column=0, sticky=tk.W)
        
        # 파일 목록 영역
        files_frame = ttk.LabelFrame(main_frame, text="발견된 컴포넌트 파일들", padding="10")
        files_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
        
        # 트리뷰 생성
        self.file_tree = ttk.Treeview(files_frame, columns=('path', 'type'), show='tree headings')
        self.file_tree.heading('#0', text='파일명')
        self.file_tree.heading('path', text='경로')
        self.file_tree.heading('type', text='타입')
        
        # 스크롤바
        scrollbar = ttk.Scrollbar(files_frame, orient=tk.VERTICAL, command=self.file_tree.yview)
        self.file_tree.configure(yscrollcommand=scrollbar.set)
        
        self.file_tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        
        files_frame.columnconfigure(0, weight=1)
        files_frame.rowconfigure(0, weight=1)
        
        # 미리보기 영역
        preview_frame = ttk.LabelFrame(main_frame, text="생성될 Index 파일 미리보기", padding="10")
        preview_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
        
        self.preview_text = tk.Text(preview_frame, height=10, width=80)
        preview_scrollbar = ttk.Scrollbar(preview_frame, orient=tk.VERTICAL, command=self.preview_text.yview)
        self.preview_text.configure(yscrollcommand=preview_scrollbar.set)
        
        self.preview_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        preview_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        
        preview_frame.columnconfigure(0, weight=1)
        preview_frame.rowconfigure(0, weight=1)
        
        # 버튼 영역
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=4, column=0, columnspan=2, pady=10)
        
        ttk.Button(button_frame, text="파일 스캔", command=self.scan_files).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="미리보기 생성", command=self.generate_preview).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="선택한 폴더들에 Index 파일 생성", command=self.generate_index_files).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="설정 저장", command=self.save_config).pack(side=tk.LEFT, padx=5)
        
        # 그리드 가중치 설정
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(2, weight=1)
        main_frame.rowconfigure(3, weight=1)
        
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        
        # 변수 변경 시 미리보기 자동 업데이트
        self.use_typescript.trace('w', lambda *args: self.generate_preview())
        self.export_style.trace('w', lambda *args: self.generate_preview())
        
    def add_folder(self):
        """폴더 추가 다이얼로그"""
        folder_selected = filedialog.askdirectory(
            title="컴포넌트 폴더를 선택하세요",
            initialdir=self.config.get("last_directory", "")
        )
        
        if folder_selected:
            if folder_selected not in self.selected_folders:
                self.selected_folders.append(folder_selected)
                self.folder_listbox.insert(tk.END, folder_selected)
                self.config["last_directory"] = folder_selected
                self.scan_files()
            else:
                messagebox.showinfo("알림", "이미 선택된 폴더입니다.")
    
    def remove_folder(self):
        """선택된 폴더 제거"""
        selection = self.folder_listbox.curselection()
        if selection:
            index = selection[0]
            removed_folder = self.selected_folders.pop(index)
            self.folder_listbox.delete(index)
            self.scan_files()
        else:
            messagebox.showwarning("경고", "제거할 폴더를 선택해주세요.")
    
    def clear_folders(self):
        """모든 폴더 제거"""
        if self.selected_folders:
            if messagebox.askyesno("확인", "모든 폴더를 제거하시겠습니까?"):
                self.selected_folders.clear()
                self.folder_listbox.delete(0, tk.END)
                # 파일 트리와 미리보기도 초기화
                for item in self.file_tree.get_children():
                    self.file_tree.delete(item)
                self.preview_text.delete(1.0, tk.END)
                if hasattr(self, 'component_files'):
                    self.component_files.clear()
    
    def select_folder(self):
        """이전 버전과의 호환성을 위해 남겨둠"""
        self.add_folder()
    
    def scan_files(self):
        """선택된 모든 폴더에서 컴포넌트 파일들 스캔"""
        if not self.selected_folders:
            # 기존 항목 제거
            for item in self.file_tree.get_children():
                self.file_tree.delete(item)
            self.preview_text.delete(1.0, tk.END)
            self.preview_text.insert(1.0, "// 폴더를 추가해주세요.")
            return
        
        # 기존 항목 제거
        for item in self.file_tree.get_children():
            self.file_tree.delete(item)
        
        self.component_files = {}  # 폴더별로 컴포넌트 파일들을 저장
        total_files = 0
        
        # 각 선택된 폴더에서 컴포넌트 파일 찾기
        for folder in self.selected_folders:
            if not os.path.exists(folder):
                continue
                
            folder_files = []
            folder_name = os.path.basename(folder)
            
            # 폴더별 트리 노드 생성
            folder_node = self.file_tree.insert('', 'end', text=f"📁 {folder_name}", values=(folder, 'folder'))
            
            # 컴포넌트 파일 찾기
            for root, dirs, files in os.walk(folder):
                # node_modules, .git 등 제외
                dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
                
                for file in files:
                    if any(file.endswith(ext) for ext in self.config["file_extensions"]):
                        file_path = os.path.join(root, file)
                        relative_path = os.path.relpath(file_path, folder)
                        
                        # 컴포넌트 정보 추출
                        component_info = self.extract_component_info(file_path, file)
                        if component_info:
                            file_info = {
                                'file_path': file_path,
                                'relative_path': relative_path,
                                'filename': file,
                                'component_name': component_info['name'],
                                'export_type': component_info['type'],
                                'directory': os.path.dirname(relative_path),
                                'folder': folder
                            }
                            folder_files.append(file_info)
                            total_files += 1
                            
                            # 폴더 노드 하위에 파일 추가
                            self.file_tree.insert(folder_node, 'end', 
                                                text=file,
                                                values=(relative_path, component_info['type']))
            
            self.component_files[folder] = folder_files
            
            # 폴더가 비어있으면 표시
            if not folder_files:
                self.file_tree.insert(folder_node, 'end', 
                                    text="(컴포넌트 파일 없음)",
                                    values=("", "empty"))
        
        self.generate_preview()
        messagebox.showinfo("완료", f"{len(self.selected_folders)}개 폴더에서 총 {total_files}개의 컴포넌트 파일을 찾았습니다.")
    
    def extract_component_info(self, file_path, filename):
        """파일에서 컴포넌트 정보 추출"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 파일명에서 컴포넌트 이름 추출
            name_without_ext = os.path.splitext(filename)[0]
            
            # 캐멀케이스로 변환
            component_name = ''.join(word.capitalize() for word in name_without_ext.replace('-', ' ').replace('_', ' ').split())
            
            # Export 타입 확인
            if 'export default' in content:
                export_type = 'default'
            elif f'export {{' in content or f'export const {component_name}' in content or f'export function {component_name}' in content:
                export_type = 'named'
            else:
                export_type = 'unknown'
            
            return {
                'name': component_name,
                'type': export_type
            }
        except:
            return None
    
    def generate_preview(self):
        """여러 폴더의 Index 파일 미리보기 생성"""
        if not hasattr(self, 'component_files') or not self.component_files:
            self.preview_text.delete(1.0, tk.END)
            self.preview_text.insert(1.0, "// 먼저 파일을 스캔해주세요.")
            return
        
        extension = '.ts' if self.use_typescript.get() else '.js'
        export_style = self.export_style.get()
        
        all_previews = []
        
        # 각 폴더별로 미리보기 생성
        for folder, files in self.component_files.items():
            if not files:  # 빈 폴더는 건너뛰기
                continue
                
            folder_name = os.path.basename(folder)
            content = []
            
            if export_style == "named":
                # Named exports 스타일
                for comp in sorted(files, key=lambda x: x['component_name']):
                    file_path = os.path.splitext(comp['relative_path'])[0]
                    if comp['export_type'] == 'default':
                        content.append(f"export {{ default as {comp['component_name']} }} from './{file_path}'")
                    else:
                        content.append(f"export {{ {comp['component_name']} }} from './{file_path}'")
            
            elif export_style == "reexport":
                # Re-export 스타일
                for comp in sorted(files, key=lambda x: x['relative_path']):
                    file_path = os.path.splitext(comp['relative_path'])[0]
                    content.append(f"export * from './{file_path}'")
            
            all_previews.append('\n'.join(content))
        
        preview_content = '\n\n'.join(all_previews)
        
        self.preview_text.delete(1.0, tk.END)
        self.preview_text.insert(1.0, preview_content)
    
    def generate_index_file(self):
        """실제 Index 파일 생성"""
        folder = self.folder_path.get()
        if not folder or not os.path.exists(folder):
            messagebox.showerror("오류", "유효한 폴더를 선택해주세요.")
            return
        
        if not hasattr(self, 'component_files') or not self.component_files:
            messagebox.showerror("오류", "먼저 파일을 스캔해주세요.")
            return
        
    def generate_index_files(self):
        """선택된 모든 폴더에 Index 파일들 생성"""
        if not self.selected_folders:
            messagebox.showerror("오류", "폴더를 선택해주세요.")
            return
        
        if not hasattr(self, 'component_files') or not self.component_files:
            messagebox.showerror("오류", "먼저 파일을 스캔해주세요.")
            return
        
        extension = '.ts' if self.use_typescript.get() else '.js'
        export_style = self.export_style.get()
        index_filename = f"index{extension}"
        
        created_files = []
        skipped_files = []
        error_files = []
        
        # 각 폴더별로 Index 파일 생성
        for folder, files in self.component_files.items():
            if not files:  # 빈 폴더는 건너뛰기
                continue
                
            index_path = os.path.join(folder, index_filename)
            
            # 기존 파일이 있는지 확인
            if os.path.exists(index_path):
                folder_name = os.path.basename(folder)
                response = messagebox.askyesnocancel(
                    "확인", 
                    f"{folder_name} 폴더의 {index_filename} 파일이 이미 존재합니다.\n\n"
                    f"예: 덮어쓰기\n아니오: 건너뛰기\n취소: 전체 작업 중단"
                )
                
                if response is None:  # 취소
                    break
                elif response is False:  # 건너뛰기
                    skipped_files.append(index_path)
                    continue
                # response is True일 때는 덮어쓰기 진행
            
            try:
                # 파일 내용 생성
                content = []
                
                if export_style == "named":
                    # Named exports 스타일
                    for comp in sorted(files, key=lambda x: x['component_name']):
                        file_path = os.path.splitext(comp['relative_path'])[0]
                        if comp['export_type'] == 'default':
                            content.append(f"export {{ default as {comp['component_name']} }} from './{file_path}'")
                        else:
                            content.append(f"export {{ {comp['component_name']} }} from './{file_path}'")
                
                elif export_style == "reexport":
                    # Re-export 스타일
                    for comp in sorted(files, key=lambda x: x['relative_path']):
                        file_path = os.path.splitext(comp['relative_path'])[0]
                        content.append(f"export * from './{file_path}'")
                
                # 파일 쓰기
                with open(index_path, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(content))
                
                created_files.append(index_path)
                
            except Exception as e:
                error_files.append((index_path, str(e)))
        
        # 결과 메시지
        messages = []
        if created_files:
            messages.append(f"✅ {len(created_files)}개 파일이 성공적으로 생성되었습니다:")
            for file in created_files:
                messages.append(f"   - {file}")
        
        if skipped_files:
            messages.append(f"\n⏭️ {len(skipped_files)}개 파일이 건너뛰어졌습니다:")
            for file in skipped_files:
                messages.append(f"   - {file}")
        
        if error_files:
            messages.append(f"\n❌ {len(error_files)}개 파일에서 오류가 발생했습니다:")
            for file, error in error_files:
                messages.append(f"   - {file}: {error}")
        
        if messages:
            # 설정 저장
            self.config["use_typescript"] = self.use_typescript.get()
            self.config["export_style"] = self.export_style.get()
            self.save_config()
            
            result_message = '\n'.join(messages)
            if error_files:
                messagebox.showerror("완료 (오류 포함)", result_message)
            else:
                messagebox.showinfo("완료", result_message)
        else:
            messagebox.showwarning("경고", "생성된 파일이 없습니다.")
    
    def generate_index_file(self):
        """이전 버전과의 호환성을 위해 남겨둠 - 단일 폴더용"""
        if not self.selected_folders:
            messagebox.showerror("오류", "폴더를 선택해주세요.")
            return
            
        # 첫 번째 선택된 폴더만 처리 (이전 버전 호환성)
        folder = self.selected_folders[0] if self.selected_folders else None
        if not folder or not os.path.exists(folder):
            messagebox.showerror("오류", "유효한 폴더를 선택해주세요.")
            return
        
        if not hasattr(self, 'component_files') or folder not in self.component_files:
            messagebox.showerror("오류", "먼저 파일을 스캔해주세요.")
            return
        
        extension = '.ts' if self.use_typescript.get() else '.js'
        index_filename = f"index{extension}"
        index_path = os.path.join(folder, index_filename)
        
        # 기존 파일이 있으면 확인
        if os.path.exists(index_path):
            if not messagebox.askyesno("확인", f"{index_filename} 파일이 이미 존재합니다. 덮어쓰시겠습니까?"):
                return
        
        try:
            content = self.preview_text.get(1.0, tk.END).strip()
            # 첫 번째 폴더의 내용만 추출
            lines = content.split('\n')
            folder_content = []
            in_target_folder = False
            
            for line in lines:
                if line.startswith('// =========================================='):
                    in_target_folder = True
                    continue
                elif line.startswith('// ==========================================') and in_target_folder:
                    break
                elif in_target_folder and line.strip():
                    folder_content.append(line)
            
            final_content = '\n'.join(folder_content) if folder_content else content
            
            with open(index_path, 'w', encoding='utf-8') as f:
                f.write(final_content)
            
            # 설정 저장
            self.config["use_typescript"] = self.use_typescript.get()
            self.config["export_style"] = self.export_style.get()
            self.save_config()
            
            messagebox.showinfo("완료", f"{index_path}에 Index 파일이 생성되었습니다.")
            
        except Exception as e:
            messagebox.showerror("오류", f"파일 생성 중 오류가 발생했습니다: {str(e)}")
    
    def run(self):
        """프로그램 실행"""
        self.root.mainloop()

if __name__ == "__main__":
    app = IndexFileGenerator()
    app.run()