package com.example.personmanager.controller;

import com.example.personmanager.dto.PersonDTO;
import com.example.personmanager.mapper.PersonMapper;
import com.example.personmanager.model.Person;
import com.example.personmanager.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/persons")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonController {

    private final PersonService personService;
    private final PersonMapper personMapper;

    @Autowired
    public PersonController(PersonService personService, PersonMapper personMapper) {
        this.personService = personService;
        this.personMapper = personMapper;
    }

    @GetMapping
    public List<PersonDTO> getAllPersons() {
        return personMapper.toDTOList(personService.getAllPersons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPersonById(@PathVariable Long id) {
        return personService.getPersonById(id)
                .map(person -> ResponseEntity.ok(personMapper.toDTO(person)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PersonDTO> createPerson(@Valid @RequestBody PersonDTO personDTO) {
        Person person = personMapper.toEntity(personDTO);
        Person savedPerson = personService.savePerson(person);
        return new ResponseEntity<>(personMapper.toDTO(savedPerson), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonDTO> updatePerson(@PathVariable Long id, @Valid @RequestBody PersonDTO personDTO) {
        return personService.getPersonById(id)
                .map(existingPerson -> {
                    personDTO.setId(id);
                    Person person = personMapper.toEntity(personDTO);
                    Person updatedPerson = personService.savePerson(person);
                    return ResponseEntity.ok(personMapper.toDTO(updatedPerson));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Long id) {
        return personService.getPersonById(id)
                .map(person -> {
                    personService.deletePerson(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<PersonDTO> searchPersons(@RequestParam String name) {
        return personMapper.toDTOList(personService.searchPersons(name));
    }
}