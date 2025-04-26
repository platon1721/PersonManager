package com.example.personmanager.repository;


import com.example.personmanager.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepo extends JpaRepository<Person, Long> {

    List<Person> findByNameCaseInsensitive(String name);

}
