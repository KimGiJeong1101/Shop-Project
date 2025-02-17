package com.belleange.mall.util;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component // 스프링 컴포넌트로 등록되어 IoC 컨테이너에 의해 관리되는 클래스임을 선언
@Log4j2 // Log4j2를 사용하여 로깅을 위한 어노테이션
@RequiredArgsConstructor // 필드 주입을 위한 생성자를 자동으로 생성하는 롬복 어노테이션
public class CustomFileUtil {

  @Value("${com.belleange.upload.path}") // 프로퍼티 값 주입을 위한 어노테이션
  private String uploadPath; // 파일 업로드 경로를 저장하는 변수

  @PostConstruct // 객체 초기화 시점에 호출되는 메서드를 지정하는 어노테이션
  public void init(){
    File tempFolder = new File(uploadPath); // 업로드 경로에 해당하는 파일 객체 생성

    if(tempFolder.exists() == false){ // 업로드 경로에 해당하는 폴더가 존재하지 않는 경우
      tempFolder.mkdirs(); // 업로드 경로에 해당하는 폴더 생성
    }
    uploadPath = tempFolder.getAbsolutePath(); // 실제 생성된 업로드 경로를 변수에 저장
    log.info("-----------------------------------------"); // 로그 출력
    log.info(uploadPath); // 생성된 업로드 경로를 로그로 출력
  }
  // 파일 저장 메서드
  public List<String> saveFiles(List<MultipartFile> files)throws
  RuntimeException{
    if(files == null || files.size() == 0){
      return List.of(); // 빈 리스트 반환
    }//ArrayList<>다이아몬드 연산자 => 컴파일러가 타입 파라미터를 추론함
    List<String> uploadNames = new ArrayList<>(); // 업로드된 파일 이름을 저장할 리스트 생성
    for (MultipartFile multipartFile : files){
      // UUID와 원본 파일 이름을 결합하여 저장할 파일 이름 생성
      String savedName = UUID.randomUUID().toString() + " " + multipartFile.getOriginalFilename();

      // 저장 경로 생성
      Path savePath = Paths.get(uploadPath, savedName);//Path는 디렉토리의 경로 Paths는 경로를 생성하기위한
      try{                                             //메서드가있음 get()은 주어진 문자열 경로나 URI기반으로 
                                                      //Path객체를 생성함
        // 파일 저장
        Files.copy(multipartFile.getInputStream(), savePath);

        // 파일의 MIME 타입 가져오기 확장자가 무엇인지 찾는건데 이건 HTTP헤더쪽데이터를 읽음
        String contentType = multipartFile.getContentType();

        // 파일이 이미지인지 확인
        if(contentType != null && contentType.startsWith("image")){
          // 썸네일 생성을 위한 경로 설정
          Path thumbnailPath = Paths.get(uploadPath, "s_" + savedName);

          // 이미지 크기 조정 및 썸네일 생성
          Thumbnails.of(savePath.toFile())
                    .size(200,200)
                    .toFile(thumbnailPath.toFile());
        }

        // 업로드된 파일 이름 리스트에 추가
        uploadNames.add(savedName);
      }catch(IOException e){
        throw new RuntimeException(e.getMessage());
      }
    }//end for
    return uploadNames; // 업로드된 파일 이름 리스트 반환
  }


//===============================================================================================


  // 파일 다운로드 메서드
  public ResponseEntity<org.springframework.core.io.Resource> getFile(String fileName){
    FileSystemResource resource = new FileSystemResource(uploadPath + File.separator + fileName);
    //파일을 읽거나 쓰기위해 리소스를 만듬

    // 파일이 읽을 수 없는 경우 기본 이미지로 대체
    if( ! resource.isReadable()){//읽을수없으면 
        resource = new FileSystemResource(uploadPath + File.separator + "default.jpg");
    }

    HttpHeaders headers = new HttpHeaders(); //HttpHeader 객체생성

    try{
        // 파일의 MIME 타입 설정
        headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
    }catch(Exception e){
        return ResponseEntity.internalServerError().build();//500에러로 빌드해서 보냄
    }
    // 파일 다운로드 응답 반환
    return ResponseEntity.ok().headers(headers).body(resource);//ok되면 헤더에 헤더장착,바디에 이미지장착
  }

//Path는 뷰에서 클라이언트가 업로드시킬때 발생하는 일을 처리하는 함수
//FileSystemResource는 프로젝트내에서 클라이언트에게 보낼때 쓰는 것
//===============================================================================================

  // 파일 삭제 메서드
public void deleteFiles(List<String> fileNames){
    // 파일 목록이 비어있거나 null인 경우 아무 작업도 수행하지 않고 메서드를 종료합니다.
    if(fileNames == null || fileNames.size() == 0){
        return;
    }

    // 주어진 파일 목록에 대해 반복하여 각 파일을 삭제합니다.
    fileNames.forEach(fileName -> {
        // 썸네일 파일명 생성: 기존 파일 이름에 's_'를 접두사로 추가하여 썸네일 파일 이름을 생성합니다.
        String thumbnailFileName = "s_" + fileName;
        
        // 삭제할 파일의 경로와 썸네일 파일의 경로를 생성합니다.
        Path filePath = Paths.get(uploadPath, fileName); // 삭제할 파일의 경로
        Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName); // 썸네일 파일의 경로
        
        try{
            // 파일 및 썸네일 파일을 삭제합니다. 만약 파일이 존재하지 않아도 에러가 발생하지 않도록 deleteIfExists() 메서드를 사용합니다.
            Files.deleteIfExists(filePath); // 삭제할 파일 삭제 => deleteIfExists 는 UUID는 제외시키고 파일이름을 읽음
            Files.deleteIfExists(thumbnailPath); // 썸네일 파일 삭제
        } catch(IOException e){
            // 파일 삭제 중 오류가 발생한 경우 RuntimeException을 발생시킵니다.
            throw new RuntimeException(e.getMessage());
        }
    });
}
}
