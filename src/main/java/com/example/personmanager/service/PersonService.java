package com.example.personmanager.service;

import com.example.personmanager.model.Person;
import com.example.personmanager.repository.PersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {

    private final PersonRepo personRepository;

    @Autowired
    public PersonService(PersonRepo personRepo) {
        this.personRepository = personRepo;
    }

    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public Optional<Person> getPersonById(Long id) {
        return personRepository.findById(id);
    }

    public Person savePerson(Person person) {
        return personRepository.save(person);
    }

    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }

    public List<Person> searchPersons(String name) {
        return personRepository.findByNameContainingIgnoreCase(name);
    }
}