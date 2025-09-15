package condosync.backend.services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class RegisterService {

    private final RestTemplate restTemplate;
    private final String apiKey = "98bdaf0ead201f1436ccdb042fca9e8ea7b11c2f2d84a09b69428b9a0e044b04";
    private final String url = "https://api.cpfhub.io/api/cpf";

    public RegisterService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean validarCpf(String cpf) {
        try {
            String birthDate = "10/03/2000";
            Map<String, String> body = new HashMap<>();
            body.put("cpf", cpf);
            body.put("birthDate", birthDate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                return success != null && success;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
